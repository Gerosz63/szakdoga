export type User = {
     id?: number,
     username: string,
     password?: string,
     role: "admin" | "user",
     theme?: "dark" | "light"
};

type GeneratorBase = {
     id: number,
     uid: number,
     name: string,
     active: boolean,
};

export type GasEngine = GeneratorBase & {
     gmax: number | string,
     gplusmax: number | string,
     gminusmax: number | string,
     cost: number | string,
     g0: number | string,
};

export type SolarPanel = GeneratorBase & {
     r_max: number | string,
     delta_r_plus_max: number | string,
     delta_r_minus_max: number | string,
     cost: number | string,
     r0: number | string,
     shift_start: number | string,
     exp_v: number | string,
     intval_range: number | string,
     value_at_end: number | string,
     addNoise: boolean | string,
     seed: number | string,
};

export type EnergyStorage = GeneratorBase & {
     storage_min: number | string,
     storage_max: number | string,
     charge_max: number | string,
     discharge_max: number | string,
     charge_loss: number | string,
     discharge_loss: number | string,
     charge_cost: number | string,
     discharge_cost: number | string,
     s0: number | string,
};

export type Results = {
     id: number,
     uid: number,
     name: string,
     data: string,
     saved: boolean,
}

export type Charts = {
     elements: {
          GAS: { name: string, data: number[] }[],
          SOLAR: { name: string, data: number[] }[],
          STORAGE: {
               name: string, data: {
                    store: number[],
                    charge: number[],
                    discharge: number[],
               }
          }[]
     },
     sumByType: {
          GAS: { name: string, data: number[] },
          SOLAR: { name: string, data: number[] },
          STORAGE: {
               store: { name: string, data: number[] },
               charge: { name: string, data: number[] },
               discharge: { name: string, data: number[] },
               produce: { name: string, data: number[] }
          }
     }
};

export type ChartData = {
     xLabels: number[] | string[],
     chartdata: {
          name: string, data: number[]
     }
};



export type DbActionResult<T> = {
     success: boolean,
     result: T | null,
     message?: string
};

export const GasEngineNameExchange: GasEngine = {
     id: 0,
     uid: 0,
     name: "Gázmotor neve",
     active: false,
     gmax: "Maximális termelés",
     gplusmax: "Maximális felfutási ráta",
     gminusmax: "Maximális lefutási ráta",
     cost: "Költség megtermelt egységenként",
     g0: "Kezdeti termelés",
};

export const SolarPanelNameExchange: SolarPanel = {
     id: 0,
     uid: 0,
     name: "Napelem neve",
     active: false,
     r_max: "Maximális termelés",
     delta_r_plus_max: "Maximális felfutási ráta",
     delta_r_minus_max: "Maximális lefutási ráta",
     cost: "Költség megtermelt egységenként",
     r0: "Kezdeti termelés",
     shift_start: "Eltolás mértéke",
     exp_v: "Maximum helye",
     intval_range: "Környezet mérete",
     value_at_end: "Környezet szélén lévő érték",
     addNoise: "Zaj:",
     seed: "Seed értéke",
};

export const EnergyStorageNameExchange: EnergyStorage = {
     id: 0,
     uid: 0,
     name: "Energia tároló neve",
     active: false,
     storage_min: "Minimális töltöttségi szint",
     storage_max: "Maximális töltöttségi szint",
     charge_max: "Maximális töltés mértéke",
     discharge_max: "Maximális kisülés mértéke",
     charge_loss: "Töltési veszteségi együttható",
     discharge_loss: "Kisülési veszteségi együttható",
     charge_cost: "Töltés költsége egységenként",
     discharge_cost: "Kisülés költsége egységenként",
     s0: "Kezdeti töltöttségi szint",
};

export type DBShortName = {
     GAS: string,
     SOLAR: string,
     STORE: string
};

export type SolverData = {
     demand: number[],
     generators: {
          GAS: GasEngine[],
          SOLAR: SolarPanel[],
          STORAGE: EnergyStorage[],
     },
     result: number[]
};

export const DbNameExchange: DBShortName = {
     GAS: "gas_engines",
     SOLAR: "solar_panel",
     STORE: "energy_storage",
}

export type UserState = {
     errors?: {
          username?: string[];
          password?: string[];
          password_rep?: string[];
          role?: string[];
          theme?: string[];
          general?: string[];
     };
     message?: string | null;
};

export type GasEngineState = {
     errors?: {
          name?: string[];
          gmax?: string[];
          gplusmax?: string[];
          gminusmax?: string[];
          cost?: string[];
          g0?: string[];
          general?: string[];
     };
     message?: string | null;
};

export type EnergyStorageState = {
     errors?: {
          name?: string[];
          storage_min?: string[];
          storage_max?: string[];
          charge_max?: string[];
          discharge_max?: string[];
          charge_loss?: string[];
          discharge_loss?: string[];
          charge_cost?: string[];
          discharge_cost?: string[];
          s0?: string[];
          general?: string[];
     };
     message?: string | null;
};

export type SolarPanelState = {
     errors?: {
          name?: string[];
          r_max?: string[];
          delta_r_plus_max?: string[];
          delta_r_minus_max?: string[];
          cost?: string[];
          r0?: string[];
          shift_start?: string[];
          exp_v?: string[];
          range?: string[];
          value_at_end?: string[];
          addNoise?: string[];
          seed?: string[];
          general?: string[];
     };
     message?: string | null;
};



export const publicRoutes = [
     "/",
];

export const authRoutes = [
     "/login",
];

export const apiAuthRoute = "/api/auth";

export const adminRoute = "/usermanager";

export const defaultLoginRedirect = "/home";