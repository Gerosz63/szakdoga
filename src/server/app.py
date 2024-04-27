import json
import math
from optimizer import solve, VPPEnergyStorage, VPPGasEngine, VPPSolarPanel
import numpy as np
# app.py
from flask import Flask, request

app = Flask(__name__)

@app.get("/solardata")
def get_solar_data():
    data = {"T": 24, "value_at_end":0.001, "exp_v": 13, "shift_start":0, "r_max": 1000, "addNoise": True, "seed":None, "intval_range":7}
    data = json.loads(request.args.get("data"))
    try:
        x = np.arange(0, data["T"])
        deviation = math.sqrt((-0.5 * (data["intval_range"]**2) / math.log(data["value_at_end"])))
        y = np.e**(-((x-data["exp_v"])**2)/(2*deviation**2))
        y = (y - data["value_at_end"]) / (np.max(y) - data["value_at_end"])
        y[y < 0] = 0
            

        if data["shift_start"] != 0:
            y = np.roll(y, -data["shift_start"])

        y = y * data["r_max"]


        if data["addNoise"]:
            if data["seed"] != None:
                gen = np.random.default_rng(data["seed"])
            else:
                gen = np.random.default_rng()
            noise = gen.uniform(-y, 0, size=data["T"])
            y += noise
    except Exception as e:
        print("Hiba", e)
        return json.dumps({"success": False, "message": str(e), "result": None})
    return json.dumps({"success": True, "message": None, "result": y.tolist()})

@app.get("/solve")
def get_results():
    data = {"demand": [], "generators": {"GAS": [], "SOLAR": [], "STORAGE": []}}
    data = json.loads(request.args.get("data"))
    demand_ = np.array(data["demand"])
    items = []
    
    try:
        for (k,e) in data["generators"].items(): 
            if k == "GAS":
                for i in e:
                    items.append(VPPGasEngine(i["gmax"], i["gplusmax"], i["gminusmax"], i["cost"], i["g0"]))
            elif k == "SOLAR":
                for i in e:
                    items.append(VPPSolarPanel(i["r_max"], i["delta_r_plus_max"], i["delta_r_minus_max"], i["cost"], demand_.size, i["r0"], i["shift_start"], i["exp_v"], i["intval_range"], i["value_at_end"], i["addNoise"] == 1, i["seed"]))
            elif k == "STORAGE":
                for i in e:
                    items.append(VPPEnergyStorage(i["storage_min"], i["storage_max"], i["charge_max"], i["discharge_max"], i["charge_loss"], i["discharge_loss"], i["charge_cost"], i["discharge_cost"], i["s0"]))
    except Exception as e:
        print("Hiba", e)
    res = solve(items, demand_.size, demand_, np.zeros_like(demand_))
    print("\n=============================================\n", res, "\n=============================================\n")
    if (res[0]):
        return json.dumps({"success": True, "result": res[1].x.tolist(), "exec_time": res[3] * 1000})
    
    return json.dumps({"success": False, "result": [], "exec_time": 0})