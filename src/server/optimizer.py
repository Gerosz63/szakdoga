import numpy as np
from scipy.optimize import linprog
import math
import time

class VPPItem:
    def lp_get_constraints(self, T:int) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        return np.zeros((1,T)), np.zeros(1), np.zeros((1,T)), np.zeros(1) # leq mm, leq v, eq m, eq v 
    def lp_get_cost(self, T:int) -> np.ndarray:
        return np.zeros(T)
    
    
class VPPGasEngine(VPPItem):
    def __init__(self, g_max:float, g_plus_max:float, g_minus_max:float, cost:float, g0:float|None = None):
        # Ellenőrzések:
        if g_max < 0. or g_plus_max < 0. or g_minus_max < 0.:
            raise Exception("A g_max, g_plus_max, g_minus_max értékek nem lehetnek 0-nál kisebb értékek!")
        
        self.g_max = g_max
        self.g_plus_max = g_plus_max
        self.g_minus_max = g_minus_max
        self.cost = cost

        # Amennyiben a g0 nem megfelelő értékű javítjuk azt
        if g0 != None:
            if g0 < 0:
                g0 = 0
            elif g0 > g_max:
                g0 = g_max
        self.g0 = g0

    def lp_get_constraints(self, T:int) -> tuple[np.ndarray, np.ndarray, np.ndarray|None, np.ndarray|None]:
        mm, vm = LinearConstraints.generate_constraints_min_max(T, 0, self.g_max)
        mmc, vmc = LinearConstraints.generate_constraints_min_max_time(T, self.g_minus_max, self.g_plus_max)

        
        if self.g0 != None:
            s0m = np.zeros((2, T), dtype=np.float32)
            s0m[0, 0] = -1.
            s0m[1, 0] = 1
            s0v = np.array([self.g_minus_max - self.g0, self.g_plus_max + self.g0], dtype=np.float32)
            m, v = MatrixMerger.Merge_LP_Constraints([mm, mmc, s0m], [vm, vmc, s0v])
        else:
            m, v = MatrixMerger.Merge_LP_Constraints([mm, mmc], [vm, vmc])


        return m, v, None, None
    def lp_get_cost(self, T:int) -> np.ndarray:
        return np.full(T, self.cost, dtype=np.float32)

class VPPEnergyStorage(VPPItem):
    def __init__(self,storage_min:float, storage_max:float, charge_max:float,
                 discharge_max:float, charge_loss:float, discharge_loss:float, charge_cost:float, discharge_cost:float, s0:float|None = None):
        
        # Ellenőrzések:
        if storage_min < 0. or storage_max < 0. or charge_max < 0. or discharge_max < 0.:
            raise Exception("A storage_min, storage_max, charge_max, discharge_max értékek nem lehetnek 0-nál kisebb értékek.")
        elif storage_max < storage_min:
            raise Exception("A storage_min értéke nem lehet nagyobb mint a storage_max-é!")
        elif discharge_loss < 0. or discharge_loss >= 1. or charge_loss < 0. or charge_loss >= 1.:
            raise Exception("A discharge_loss és charge_loss értékeknek legalább 0-nak és 1-nél kevesebbnek kell lennie!")

        self.storage_min = storage_min
        self.storage_max = storage_max
        self.charge_max = charge_max
        self.discharge_max = discharge_max
        self.charge_loss = charge_loss
        self.discharge_loss = discharge_loss
        self.charge_cost = charge_cost
        self.discharge_cost = discharge_cost

        # A kezdőérték beállítása
        if s0 == None:
            s0 = storage_min
        else:
            if s0 < storage_min:
                s0 = storage_min
            elif s0 > storage_max:
                s0 = self.storage_max
        self.s0 = s0

    '''
    A kényszerek vektora:

    s(0)
    s(1)
    ...
    c(0)
    c(1)
    ...
    d(0)
    d(1)
    ...

    '''
    def lp_get_constraints(self, T:int) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        sm, sv = LinearConstraints.generate_constraints_min_max(T, self.storage_min,self.storage_max)
        cm, cv = LinearConstraints.generate_constraints_min_max(T, 0, self.charge_max)
        dm, dv = LinearConstraints.generate_constraints_min_max(T, 0, self.discharge_max)
        m, v = MatrixMerger.MergeDiff_LP_Constraints([sm, cm, dm], [sv, cv, dv])

        # Kezdő érték beállítása, ha van
        eqm = np.zeros((1, 3 * T), dtype=np.float32)
        eqm[0, 0] = 1
        eqm[0, T] = -1. + self.charge_loss
        eqm[0, 2*T] = 1. + self.discharge_loss
        eqv = np.array([self.s0], dtype=np.float32)

        # A kontinuitás felállítása
        contm, contv = LinearConstraints.generate_constraints_continuity(T, self.charge_loss, self.discharge_loss)
        eqm = np.concatenate([eqm, contm], axis=0)
        eqv = np.concatenate([eqv, contv])
        return m, v, eqm, eqv

    def lp_get_cost(self, T: int) -> np.ndarray:
        return np.concatenate([np.zeros(T, dtype=np.float32), np.full(T, (1-self.charge_loss)*self.charge_cost, dtype=np.float32), np.full(T,(1+self.discharge_loss)*self.discharge_cost, dtype=np.float32)], axis=0)

class VPPSolarPanel(VPPItem):
    def __init__(self, r_max:float, delta_r_plus_max:float, delta_r_minus_max:float, cost:float, T:int, r0:float|None = None, starting:int=0, exp_v:float=13, range:float=8, value_at_end:float=0.001, addNoise:bool=True, seed=None):
        # Ellenőrzések:
        if delta_r_plus_max < 0. or r_max < 0. or delta_r_minus_max < 0. or T < 0:
            raise Exception("A delta_r_plus_max, r_max, delta_r_minus_max, T értékek nem lehetnek 0-nál kisebbek!")


        self.delta_r_plus_max = delta_r_plus_max
        self.r_max = r_max
        self.delta_r_minus_max = delta_r_minus_max
        self.cost = cost
        self.T = T
        self.exp_v = exp_v
        self.range = range
        self.addNoise = addNoise

        x = np.arange(0, T)
        deviation = math.sqrt((-0.5 * (range**2) / math.log(value_at_end)))
        self.deviation = deviation
        y = np.e**(-((x-exp_v)**2)/(2*deviation**2))
        self.original = np.copy(y)
        y = (y - value_at_end) / (np.max(y) - value_at_end)
        y[y < 0] = 0
        
        # A kezdő intervallum beállítása, ha helytelenül lenne megadva
        if starting < 0:
            starting = 0
        elif starting >= T:
            starting = T - 1

        if starting != 0:
            y = np.roll(y, -starting)

        self.r_max_values = y * r_max


        if addNoise:
            if seed != None:
                gen = np.random.default_rng(seed)
            else:
                gen = np.random.default_rng()
            noise = gen.uniform(-self.r_max_values, 0, size=T)
            self.r_max_values += noise
        if r0 != None:
            if r0 < 0:
                r0 = 0
            self.r0 = r0
        else:
            self.r0 = None
    
    def lp_get_constraints(self, T:int) -> tuple[np.ndarray, np.ndarray, np.ndarray|None, np.ndarray|None]: 
        m, v = LinearConstraints.generate_constraints_min_max(T, 0, 10)
        v[:T] = self.r_max_values
        
        mmm, mmv = LinearConstraints.generate_constraints_min_max_time(T, self.delta_r_minus_max, self.delta_r_plus_max)


        # Kezdő érték beállítása, ha van
        
        if self.r0 == None:
            m, v = MatrixMerger.Merge_LP_Constraints([m, mmm], [v, mmv])
        else:
            r0m = np.zeros((2, T), dtype=np.float32)
            r0m[0, 0] = -1
            r0m[1, 0] = 1
            r0v = np.array([self.delta_r_minus_max - self.r0, self.delta_r_plus_max + self.r0], dtype=np.float32)
            m, v = MatrixMerger.Merge_LP_Constraints([m, mmm, r0m], [v, mmv, r0v])
        
        return m, v, None, None    
    def lp_get_cost(self, T:int) -> np.ndarray: 
        return np.full(T, self.cost)

class VPPRenewable(VPPItem):
    def __init__(self, e_max:np.ndarray, cost:float, label:str):
        aclist = ["SP", "WP"] # solar power, wind power
        if label not in aclist:
            raise Exception("A lable paraméternek csak a következő értékeket veheti fel: ", aclist)

        self.e_max = e_max
        self.cost = cost
        self.label = label
        self.is_MILP = False

    def lp_get_constraints(self, T:int) -> tuple[np.ndarray, np.ndarray, np.ndarray|None, np.ndarray|None]:
        m, v = MatrixMerger.Merge_LP_Constraints([np.eye(T, T) * -1, np.eye(T, T)],[np.zeros(T), self.e_max])
        return m, v, None, None
    
    def lp_get_cost(self, T:int) -> np.ndarray:
        return np.full(T, self.cost)


class LinearConstraints:

    @staticmethod
    def generate_constraints_min_max(T:int, min:float, max:float) -> tuple[np.ndarray, np.ndarray]: #sima korlátosság
        A = np.concatenate((np.eye(T),np.diag(np.full((T,), -1))),axis=0)
        b = np.concatenate([np.full(T,max), np.full(T,-1 * min)])
        return A, b


    @staticmethod
    def generate_constraints_min_max_time(T:int, min:float, max:float) -> tuple[np.ndarray, np.ndarray]: #i,t időpillanatból kivonjuk az i,t-1 időpillanatot
        min_matrix = np.zeros((T-1, T))
        np.fill_diagonal(min_matrix[:,:-1], 1)
        np.fill_diagonal(min_matrix[:,1:], -1)

        max_matrix = np.zeros((T-1, T))
        np.fill_diagonal(max_matrix[:,:-1], -1)
        np.fill_diagonal(max_matrix[:,1:], 1)

        A = np.concatenate((min_matrix,max_matrix),axis=0)
        b = np.concatenate((np.full(T - 1, min), np.full(T - 1,max)))
        return A, b

    @staticmethod
    def generate_constraints_continuity(T:int, charge_loss:float ,discharge_loss:float) -> tuple[np.ndarray, np.ndarray]:
        contm = np.zeros((T - 1, 3 * T), dtype=np.float32).reshape(-1)
        contm[0::3*T+1] = 1
        contm[1::3*T+1] = -1
        contm[T + 1::3*T + 1] = 1. - charge_loss
        contm[2*T + 1::3*T + 1] = -1. - discharge_loss
        contm = contm.reshape((T - 1, 3 * T))
        contv = np.zeros(T-1, dtype=np.float32)
        return contm, contv

class MatrixMerger:
    # =====================================
    # LP kényszerek
    # =====================================
    '''A VPP részvevőinek kényszerfeltételik és költség függvényeik összefűzését végző függvény'''
    @staticmethod
    def MergeAllVPPItem_LP_ConstraintsAndCost(itemList:list[VPPItem], d:np.ndarray, l:np.ndarray, T:int) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:

        # A <= kényszerek mátrixa és vektora
        m = list()
        v = list()

        cf = list() #költség függvény

        # Termelési kényszer sum(gi,t) +  sum(di,t) ...
        eqm = 0
        eqv = d+l

        # Az = kényszerek mátrixa és vektora
        eqml = list()
        eqvl = list()


        # Végi megyünk a VPP részvevőkön
        for e in itemList:
            ma, ve, sm, sv = e.lp_get_constraints(T) # Elkérjük a kényszeriket
            cf.append(e.lp_get_cost(T)) # a költség függvényt

            if (ma is not None):
                m.append(ma)
                v.append(ve)
            else:
                if isinstance(e, VPPEnergyStorage):
                    m.append(np.zeros((1, 3 * T), dtype=np.float32))
                    v.append(np.zeros(1, dtype=np.float32))
                else:
                    m.append(np.zeros((1, T), dtype=np.float32))
                    v.append(np.zeros(1, dtype=np.float32))

            if sm is not None:
                eqml.append(sm)
                eqvl.append(sv)
            else:
                if isinstance(e, VPPEnergyStorage):
                    eqml.append(np.zeros((1, 3 * T), dtype=np.float32))
                    eqvl.append(np.zeros(1, dtype=np.float32))
                else:
                    eqml.append(np.zeros((1, T), dtype=np.float32))
                    eqvl.append(np.zeros(1, dtype=np.float32))


                
            # összerakjuk a "Energiaigény és összenergia" pont alatti kényszert
            # A tárolók esetén figyelni kell, hogy csak a d(j,t) és c(j,t) szerepel a képletben így a többit ki kell nullázni
            if type(eqm) == int:
                if isinstance(e, VPPGasEngine) or isinstance(e, VPPSolarPanel) or isinstance(e, VPPRenewable):
                    eqm = np.eye(T, T, dtype=np.float32)
                elif isinstance(e, VPPEnergyStorage):
                    eqm = np.concatenate([np.zeros((T,T), dtype=np.float32), np.diag(np.full((T,), -1)), np.eye(T, T, dtype=np.float32)], axis=1)
                else:
                    raise Exception("Unknown VPPItem!")
            else:
                if isinstance(e, VPPGasEngine) or isinstance(e, VPPSolarPanel) or isinstance(e, VPPRenewable):
                    eqm = np.concatenate([eqm, np.eye(T, T, dtype=np.float32)], axis=1)
                elif isinstance(e, VPPEnergyStorage):
                    eqm = np.concatenate([eqm, np.zeros((T,T), dtype=np.float32), np.diag(np.full((T,), -1)), np.eye(T, T, dtype=np.float32)], axis=1)
                else:
                    raise Exception("Unknown VPPItem!")



        resm, resv = MatrixMerger.MergeDiff_LP_Constraints(m, v) # összefűzzük a <= típusú kényszereket
        eqmp, eqvp = MatrixMerger.MergeDiff_LP_Constraints(eqml, eqvl) # összefűzzük a = típusú kényszereket
        
        # Az '=' típusú kényszerek összeszerelése
        eqm = np.concatenate([eqm, eqmp], axis=0)
        eqv = np.concatenate([eqv, eqvp], axis=0)


        # A mátrixok optimalizálása
        eqm, eqv = MatrixMerger.Optimaze_LP_MatrixesAndVectors(eqm, eqv)
        resm, resv = MatrixMerger.Optimaze_LP_MatrixesAndVectors(resm, resv)
        
        return resm, resv, np.concatenate(cf, axis=0), eqm, eqv
    
    '''
    A függvény optimalizálja a megadott kényszer mátrixot:
        - Kiveszi belőle duplikált sorokat
        - Megszünteti a csupa nulla sorokat (mind a mátrixban 0 van mind a vektorban)
    '''
    @staticmethod
    def Optimaze_LP_MatrixesAndVectors(m:np.ndarray, v:np.ndarray) -> tuple[np.ndarray, np.ndarray]:
        data = np.concatenate([m, v.reshape(-1, 1)], axis=1)
        uniques = np.unique(data, axis=0)
        uniques = uniques[np.logical_not(np.all(np.logical_not(uniques != 0), axis=1))]
        m = uniques[:,:-1]
        v = uniques[:,-1].reshape(-1)
        return m, v

    @staticmethod
    def MergeDiff_LP_Constraints(m:list[np.ndarray], v:list[np.ndarray]) -> tuple[np.ndarray, np.ndarray]:
        resv = np.concatenate(v, axis=0)
        resm = m.pop(0)
        for e in m:
            resShape = resm.shape
            newShape = e.shape
            resm = np.concatenate([resm, np.zeros((resShape[0], newShape[1]), dtype=np.float32)], axis=1) # Az eredeti mátrix jobb oldalát feltöltjük 0-ákkal
            newElem = np.concatenate([np.zeros((newShape[0], resShape[1]), dtype=np.float32), e], axis=1) # az új mátrix bal oldalát is feltöltjük 0-ákkal
            resm = np.concatenate([resm, newElem], axis=0)# A két mátrixot össze fűzzük
        return resm, resv
    '''
    Ha egy VPP résztvevőnek több kényszerfeltétele van akkor azokat lehet a függvény segítségével egyesíteni
    A függvény az 1 koordináta alapján fűzi össze őket
    '''
    @staticmethod
    def Merge_LP_Constraints(matrix:list[np.ndarray], vector:list[np.ndarray]) -> tuple[np.ndarray, np.ndarray]:
        m = np.concatenate(matrix, axis=0)
        v = np.concatenate(vector, axis=0)
        return m, v

def solve(items:list[VPPItem], T:int, l:np.ndarray, d:np.ndarray, debug=False, tofile=None, checker=None):
     st = time.time()
     cm, cv, cf, sc, scv = MatrixMerger.MergeAllVPPItem_LP_ConstraintsAndCost(items, d, l, T)
     ed = time.time()
     res = linprog(cf, A_ub=cm, b_ub=cv, A_eq=sc, b_eq=scv)
     if debug:
          if checker is not None:
               checkres_leq = np.sum(cm * checker, axis=1) <= cv
               checkres_eq = np.sum(sc * checker, axis=1) <= scv
          print("Ge matrix and vector:")
          for i in range(cm.shape[0]):
               print(cm[i], sep=', ', end = '')
               if checker is not None:
                    print(" <= ", cv[i], sep='', end="")
                    print(" | ", checkres_leq[i])
               else:
                    print(" <= ", cv[i], sep='')
               
          print("\n\nEqv matrix and vector:")
          for i in range(sc.shape[0]):
               print(sc[i], sep=', ', end = '')
               if checker is not None:
                    print(" = ", scv[i], sep='', end="")
                    print(" | ", checkres_eq[i])
               else:
                    print(" = ", scv[i], sep='')
               
          print("\n\nKöltség függvény: ", cf, end="\n\n")
          print("\n\nAz optimalizáló eredménye: ", res, end="\n\n")

          if tofile is not None:
               f = open(tofile, "w")
               f.write("Ge matrix and vector:")
               for i in range(cm.shape[0]):
                    f.write(np.array2string(cm[i], separator='\t') + " <= " + np.array2string(cv[i], separator='\t'))
                    f.write("\n\nEqv matrix and vector:")
               for i in range(sc.shape[0]):
                    f.write(np.array2string(sc[i], separator='\t') + " = " + np.array2string(scv[i], separator='\t'))
                    f.write("\n\nKöltség függvény: " + np.array2string(cf, separator='\t') + "\n\n")
                    f.close()

     if res.success:
          return True, res, cf, ed-st
     else:
          return False, res, 0, ed-st