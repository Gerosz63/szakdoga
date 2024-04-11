import json
from optimizer import solve, VPPEnergyStorage, VPPGasEngine, VPPSolarPanel
import numpy as np
# app.py
from flask import Flask, request

app = Flask(__name__)

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
        return json.dumps({"success": True, "result": res[1].x.tolist()})
    
    return json.dumps({"success": False, "result": []})