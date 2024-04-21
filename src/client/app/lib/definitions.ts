/**
 * Type of the user in the database.
 */
export type User = {
     id?: number,
     username: string,
     password?: string,
     role: "admin" | "user",
     theme?: "dark" | "light"
};

/**
 * A type for fields which can be found in all types of generators
 */
type GeneratorBase = {
     id: number,
     uid: number,
     name: string,
     active: boolean,
};

/**
 * The type of gas engines
 */
export type GasEngine = GeneratorBase & {
     gmax: number | string,
     gplusmax: number | string,
     gminusmax: number | string,
     cost: number | string,
     g0: number | string,
};

/**
 * The type of solar panels
 */
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

/**
 * The type of energy storages
 */
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

/**
 * The type of the results
 */
export type Results = {
     id: number,
     uid: number,
     name: string,
     saveDate: Date,
     data: string,
     saved: boolean,
     exec_time: number
}

/**
 * The type which the backend will produce data for chart visualization (all type included)
 */
export type Charts = {
     id: number,
     name: string,
     labels: number[],
     demand: number[],
     generators: {
          GAS: GasEngine[],
          SOLAR: SolarPanel[],
          STORAGE: EnergyStorage[],
     },
     exec_time: number,
     saveDate: Date,
     elementTypes: {
          GAS: boolean,
          SOLAR: boolean,
          STORAGE: boolean,
     },
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

/**
 * Type for single chart data for visualization
 */
export type ChartData = {
     xLabels: number[],
     chartdata: {
          name: string, data: number[]
     }[]
     demand?: number[],
     store?: {
          name: string, data: number[]
     }[]
};

/**
 * Type for backend action result.
 */
export type DbActionResult<T> = {
     success: boolean,
     result: T | null,
     message?: string
};

/**
 * Name exchange for gas engine fields and visualized texts
 */
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

/**
 * Name exchange for solar panel fields and visualized texts
 */
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
     intval_range: "Sugár mérete",
     value_at_end: "Görbe szélén lévő érték",
     addNoise: "Zaj:",
     seed: "Seed értéke",
};

/**
 * Name exchange for energy storage fields and visualized texts
 */
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

/**
 * Type for exchange DB tables sort name fro actual name
 */
export type DBShortName = {
     GAS: string,
     SOLAR: string,
     STORE: string
};

/**
 * Type of data which goes between the solver API and the backend
 */
export type SolverData = {
     demand: number[],
     generators: {
          GAS: GasEngine[],
          SOLAR: SolarPanel[],
          STORAGE: EnergyStorage[],
     },
     result: number[]
};

/**
 * DB table name exchange
 */
export const DbNameExchange: DBShortName = {
     GAS: "gas_engines",
     SOLAR: "solar_panel",
     STORE: "energy_storage",
}

/**
 * Form state type for suer manager
 */
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

/**
 * Helper type for GasEngineState
 */
export type GasEngineStateError = {
     name?: string[];
     gmax?: string[];
     gplusmax?: string[];
     gminusmax?: string[];
     cost?: string[];
     g0?: string[];
     general?: string[];
}

/**
 * Form state type for gas engines
 */
export type GasEngineState = {
     errors?: GasEngineStateError;
     message?: string | null;
};

/**
 * Helper type for EnergyStorageState
 */
export type EnergyStorageStateError = {
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
}

/**
 * Form state type for energy storages
 */
export type EnergyStorageState = {
     errors?: EnergyStorageStateError;
     message?: string | null;
};

/**
 * Helper type for SolarPanelState
 */
export type SolarPanelStateError = {
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
}

/**
 * Form state type for solar panels
 */
export type SolarPanelState = {
     errors?: SolarPanelStateError;
     message?: string | null;
};


/**
 * list of public routes
 */
export const publicRoutes = [
     "/",
];

/**
 * List of login routes
 */
export const authRoutes = [
     "/login",
];

/**
 * The auth API route
 */
export const apiAuthRoute = "/api/auth";

/**
 * The route which can be accessed only with admin role
 */
export const adminRoute = "/usermanager";

/**
 * The page route where the user should be redirected after login.
 */
export const defaultLoginRedirect = "/simulate";