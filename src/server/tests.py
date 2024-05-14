import unittest
import requests
from optimizer import VPPGasEngine, VPPEnergyStorage, VPPSolarPanel, solve 
import json
import numpy as np
import math

api_url_solve = "http://127.0.0.1:5000/solve"
api_url_solardata = "http://127.0.0.1:5000/solardata"
params = {"data": ""}
test_data_SP = {"T": 24, "value_at_end": 0.001, "exp_v": 12, "shift_start":0, "r_max": 10000, "addNoise": False, "seed":None, "intval_range":7}
test_data_S = {"demand": [1,1,1,1,1], "generators": {"GAS": [{"gmax" : 100, "gplusmax": 2, "gminusmax": 2, "cost": 100, "g0": None}], "SOLAR": [], "STORAGE": []}}

def opt(items, l, T, addRes=False):
    if addRes:
        return solve(items, T, l, np.zeros_like(l))[0:2]
    return solve(items, T, l, np.zeros_like(l))[0]

# For successful testing please start the API server. Otherwise these tests won't work properly.

# Tests for API solverdata access point.
class TestAPISolarData(unittest.TestCase):
    # Request data with None data in the params.
    def test_no_input(self):
        response = requests.get(api_url_solardata, params=params)
        results = response.json()
        self.assertFalse(results["success"])
    # Request data without the data paramater.
    def test_false_data(self):
        params = {"dt" : ""}
        response = requests.get(api_url_solardata, params=params)
        results = response.json()
        self.assertFalse(results["success"])
    # Reqest data with partially good data param structure.
    def test_partial_data(self):
        test_data_SP["exp_v"] = None
        params = {"data" : json.dumps(test_data_SP)}
        response = requests.get(api_url_solardata, params=params)
        results = response.json()
        self.assertFalse(results["success"])
    # Request data with good "data" param structure, but its values are in the wrong type.
    def test_wrong_type(self):
        test_data_SP["exp_v"] = "apple"
        params = {"data" : json.dumps(test_data_SP)}
        response = requests.get(api_url_solardata, params=params)
        results = response.json()
        self.assertFalse(results["success"])
    # Request data with good structure and values. I check here, if the arrived data is correct.
    def test_good_response(self):
        test_data_SP["addNoise"] = False
        test_data_SP["exp_v"] = 4
        test_data_SP["T"] = 9
        test_data_SP["intval_range"] = 2
        params = {"data" : json.dumps(test_data_SP)}
        response = requests.get(api_url_solardata, params=params)
        results = response.json()
        self.assertTrue(results["success"])
        self.assertEqual(len(results["result"]), 9)
        self.assertEqual(results["result"][4], 10000)
        self.assertEqual(results["result"][0] + results["result"][1], 0)
        self.assertEqual(results["result"][7] + results["result"][8], 0)

# Tests for API solve access point.
class TestAPISolve(unittest.TestCase):
    # Request data with None data in the params.
    def test_no_input(self):
        response = requests.get(api_url_solve, params=params)
        results = response.json()
        self.assertFalse(results["success"])
        self.assertEqual(results["result"], "Hiba történt!")
    # Request data without the data paramater.
    def test_false_data(self):
        params = {"dt" : ""}
        response = requests.get(api_url_solve, params=params)
        results = response.json()
        self.assertFalse(results["success"])
        self.assertEqual(results["result"], "Hiba történt!")
    # Reqest data with partially good data param structure.
    def test_partial_data(self):
        test_data_S_ = test_data_S.copy()
        test_data_S_["demand"] = None
        params = {"data" : json.dumps(test_data_S_)}
        response = requests.get(api_url_solve, params=params)
        results = response.json()
        self.assertFalse(results["success"])
    def test_partial_data_2(self):
        test_data_S_ = test_data_S.copy()
        test_data_S_["generators"] = None
        params = {"data" : json.dumps(test_data_S_)}
        response = requests.get(api_url_solve, params=params)
        results = response.json()
        self.assertFalse(results["success"])
    # Request data with good "data" param structure, but its values are in the wrong type.
    def test_wrong_type(self):
        test_data_S_ = test_data_S.copy()
        test_data_S_["demand"] = [1,1,1,"alma", "fa"]
        params = {"data" : json.dumps(test_data_S_)}
        response = requests.get(api_url_solve, params=params)
        results = response.json()
        self.assertFalse(results["success"])
    def test_wrong_type2(self):
        test_data_S_ = test_data_S.copy()
        test_data_S_["generators"]["GAS"].append({"gmax" : "hmmm", "gplusmax": 2, "gminusmax": 2, "cost": 100, "g0": None}) 
        params = {"data" : json.dumps(test_data_S_)}
        response = requests.get(api_url_solve, params=params)
        results = response.json()
        self.assertFalse(results["success"])
    # Request data with good structure and values.
    def test_good_inp(self):
        test_data_S_ = test_data_S.copy()
        params = {"data" : json.dumps(test_data_S_)}
        response = requests.get(api_url_solve, params=params)
        results = response.json()
        self.assertTrue(results["success"],test_data_S_)
        for e in results["result"]:
            self.assertEqual(e,1)

# Test for the optimizer functions
class TestOptimezer(unittest.TestCase):
    # =========================|
    # Test for only GasEngines |
    # =========================|

    #           |-------------------------|
    #           | Test for value checking |
    #           |-------------------------|
    # g_max param test
    def test_ge_params_1(self):
        self.assertRaises(Exception, lambda x: VPPGasEngine(-10, 10,10,10))
    def test_ge_params_2(self):
        self.assertRaises(Exception, lambda x: VPPGasEngine("a", 10,10,10))
    # g_plus_max param test
    def test_ge_params_3(self):
        self.assertRaises(Exception, lambda x: VPPGasEngine(10, -10,10,10))
    def test_ge_params_4(self):
        self.assertRaises(Exception, lambda x: VPPGasEngine(10, "a",10,10))
    # g_minus_max param test
    def test_ge_params_5(self):
        self.assertRaises(Exception, lambda x: VPPGasEngine(10, 10,-10,10))
    def test_ge_params_6(self):
        self.assertRaises(Exception, lambda x: VPPGasEngine(10, 10,"a",10))
    # cost param test
    def test_ge_params_7(self):
        self.assertRaises(Exception, lambda x: VPPGasEngine(10, 10,10,"a"))
    # g0 param test
    def test_ge_params_8(self):
        self.assertRaises(Exception, lambda x: VPPGasEngine(10, 10,10,10,"a"))


    #           |--------------------------------|
    #           | Test for optimalization result |
    #           |--------------------------------|

    # The with that g0 and g+max params the GE cannot produce the firts l value.  
    def test_ge_1(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 1010, 10)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertFalse(opt(items, l, T))
    # The previous test case but with correct params.
    def test_ge_2(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 1010, 10000)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertTrue(opt(items, l, T))
    # The fist test case, but without given g0 val
    def test_ge_3(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 1010)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertTrue(opt(items, l, T))
    # The difference between the 1. and 2. l values are bigger than the GE can rump up/down.
    def test_ge_4(self):
        T=3
        items = [VPPGasEngine(10000, 1000, 1000, 1330, 10000)]
        l = np.full(T, 10000, dtype=np.float32)
        l[1] = 15000
        self.assertFalse(opt(items, l, T))
    # The prev test case but now the GE cant produce enough energy in the 2. time intval.
    def test_ge_5(self):
        T=3
        items = [VPPGasEngine(10000, 5000, 5000, 1010, 10000)]
        l = np.full(T, 10000, dtype=np.float32)
        l[1] = 15000
        self.assertFalse(opt(items, l, T))
    # The prev. test case, but every param is correct.
    def test_ge_6(self):
        T=3
        items = [VPPGasEngine(15000, 5000, 5000, 1010, 10000)]
        l = np.full(T, 10000, dtype=np.float32)
        l[1] = 15000
        res = opt(items, l, T, True)
        self.assertTrue(res[0])
        self.assertTrue(np.all(res[1].x == np.array([10000,15000,10000])) ,res[1])
    # Testing small changes in the in the l param
    def test_ge_7(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 1010)]
        l = np.array([100, 143, 125], dtype=np.float32)
        res = opt(items, l, T, True)
        self.assertTrue(res[0])
        self.assertTrue(np.all(res[1].x == l), res[1])
    # The g0 val is more than the gmax val, but the model solve this problem itself.
    def test_ge_8(self):
        T=3
        items = [VPPGasEngine(10000, 5000, 5000, 1010, 20000)]
        l = np.full(T, 10000, dtype=np.float32)
        res = opt(items, l, T, True)
        self.assertTrue(res[0])
        self.assertTrue(np.all(res[1].x == l))
    # The l values diff. is more than what the GE can rump up/down. The GE need +1 to its value to solve the problem.
    def test_ge_9(self):
        T=3
        items = [VPPGasEngine(10000, 50, 50, 1010, 175)]
        l = np.array([175, 226, 300], dtype=np.float32)
        self.assertFalse(opt(items, l, T))
    # The 2 GE overall g0 prod. cannot satisfy the demand.
    def test_ge_10(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 1010, 10), VPPGasEngine(10000, 100, 100, 1010, 10)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertFalse(opt(items, l, T))
    # The perv. test case but with correct params.
    def test_ge_11(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 100), VPPGasEngine(10000, 100, 100, 100)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertTrue(opt(items, l, T))
    # The prev. test case, but with same g0 values.
    def test_ge_12(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 100, 5000), VPPGasEngine(10000, 100, 100, 100, 5000)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertTrue(opt(items, l, T))
    # The prev. test case, but only one GE has g0 param.
    def test_ge_13(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 100), VPPGasEngine(10000, 100, 100, 100, 5000)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertTrue(opt(items, l, T))
    # The prev test case, but without g0 values and the 1. GE cost is more. 
    def test_ge_14(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 500), VPPGasEngine(10000, 100, 100, 100, 5000)]
        l = np.full(T, 10000, dtype=np.float32)
        res = opt(items, l, T, True)
        self.assertTrue(res[0])
        self.assertTrue(np.all(res[1].x == np.array([4900,4800,4700,5100,5200,5300])), res[1].x)
    # ==============================|
    # Test for only Energy storages |
    # ==============================|

    #           |-------------------------|
    #           | Test for value checking |
    #           |-------------------------|

    # storage_min param test
    def test_es_params_1(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(-10, 10, 10, 10, 0.1, 0.1, 10, 10))
    def test_es_params_2(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage("a", 10, 10, 10, 0.1, 0.1, 10, 10))
    #storage_max param test
    def test_es_params_3(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, -10, 10, 10, 0.1, 0.1, 10, 10))
    def test_es_params_4(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, "a", 10, 10, 0.1, 0.1, 10, 10))
    def test_es_params_5(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(100, 10, 10, 10, 0.1, 0.1, 10, 10))
    # charge_max param test
    def test_es_params_6(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, 100, -10, 10, 0.1, 0.1, 10, 10))
    def test_es_params_7(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, 100, "a", 10, 0.1, 0.1, 10, 10))
    # discharge_max param test
    def test_es_params_8(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, 100, 10, -10, 0.1, 0.1, 10, 10))
    def test_es_params_9(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, 100, 10, "a", 0.1, 0.1, 10, 10))
    # charge_loss param test
    def test_es_params_10(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, 100, 10, 10, -0.1, 0.1, 10, 10))
    def test_es_params_11(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, 100, 10, 10, 1, 0.1, 10, 10))
    def test_es_params_12(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, 100, 10, 10, "a", 0.1, 10, 10))
    # discharge_loss param test
    def test_es_params_13(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, 100, 10, 10, 0.1, -0.1, 10, 10))
    def test_es_params_14(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, 100, 10, 10, 0.1, 1, 10, 10))
    def test_es_params_15(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, 100, 10, 10, 0.1, "a", 10, 10))
    # charge_cost param test
    def test_es_params_16(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, 100, 10, 10, 0.1, 0.1, "a", 10))
    # discharge_cost param test
    def test_es_params_17(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, 100, 10, 10, 0.1, 0.1, 10, "a"))
    # s0 param test
    def test_es_params_18(self):
        self.assertRaises(Exception, lambda x: VPPEnergyStorage(10, 100, 10, 10, 0.1, 0.1, 10, 10, "a"))
    
    #           |--------------------------------|
    #           | Test for optimalization result |
    #           |--------------------------------|

    # The ES doesn't have enough energy by default for the first demand val
    def test_es_1(self):
        T=3
        items = [VPPEnergyStorage(2000, 8000, 100, 100, 0.3, 0.3, 10, 10, 2500)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertFalse(opt(items, l, T))
    # The ES doesn't have enough energy by default, but knwo for the hol demand
    def test_es_2(self):
        T=3
        l = np.full(T, 10000, dtype=np.float32)
        allenergy = np.sum(l)
        items = [VPPEnergyStorage(allenergy * 0.2, allenergy, 100, 100, 0.3, 0.3, 10, 10, allenergy)]
        self.assertFalse(opt(items, l, T))
    # Now the energy is enough but the ES can discharge itself fast enough
    def test_es_3(self):
        T=3
        l = np.full(T, 10000, dtype=np.float32)
        allenergy = np.sum(l)
        items = [VPPEnergyStorage(allenergy * 0.2, allenergy * 1.4, 1000, 1000, 0.3, 0.3, 10, 10, allenergy *1.3)]
        self.assertFalse(opt(items, l, T))
    # Prev test case, but with correct params
    def test_es_4(self):
        T=3
        l = np.full(T, 10000, dtype=np.float32)
        allenergy = np.sum(l)
        items = [VPPEnergyStorage(allenergy * 0.2, allenergy * 2.0, 15000, 15000, 0.3, 0.3, 10, 10, allenergy * 2.0)]
        self.assertTrue(opt(items, l, T))
    # 2 ES and they cant satisfy the first element of the demand
    def test_es_5(self):
        T=3
        l = np.full(T, 10000, dtype=np.float32)
        items = [VPPEnergyStorage(2000, 8000, 100, 100, 0.3, 0.3, 10, 10, 2000),
                 VPPEnergyStorage(2000, 8000, 100, 100, 0.3, 0.3, 10, 10, 2000)]
        self.assertFalse(opt(items, l, T))
    # 2 ES and they cant satisfy the demand
    def test_es_6(self):
        T=3
        l = np.full(T, 1500, dtype=np.float32)
        items = [VPPEnergyStorage(2000, 8000, 100, 100, 0.3, 0.3, 10, 10, 2000),
                 VPPEnergyStorage(2000, 8000, 100, 100, 0.3, 0.3, 10, 10, 2000)]
        self.assertFalse(opt(items, l, T))
    # 2 ES with enough energy but not enough discharge rate 
    def test_es_7(self):
        T=3
        l = np.full(T, 10000, dtype=np.float32)
        allenergy = np.sum(l)
        items = [VPPEnergyStorage(allenergy * 0.2, allenergy * 1.4, 1000, 1000, 0.3, 0.3, 10, 10, allenergy *1.3),
                 VPPEnergyStorage(allenergy * 0.2, allenergy * 1.4, 1000, 1000, 0.3, 0.3, 10, 10, allenergy *1.3)]
        self.assertFalse(opt(items, l, T))
    # 2 ES and only togeother they can statisfy the demand
    def test_es_8(self):
        T=3
        l = np.full(T, 10000, dtype=np.float32)
        allenergy = np.sum(l)
        items = [VPPEnergyStorage(allenergy * 0.2, allenergy * 1.4, 7000, 7000, 0.3, 0.3, 10, 10, allenergy *1.3),
                 VPPEnergyStorage(allenergy * 0.2, allenergy * 1.4, 3000, 3000, 0.3, 0.3, 10, 10, allenergy *1.3)]
        self.assertTrue(opt(items, l, T))
    # 2 ES with different costs (which can discharge more is the expensive one)
    def test_es_9(self):
        T=3
        l = np.full(T, 10000, dtype=np.float32)
        allenergy = np.sum(l)
        items = [VPPEnergyStorage(allenergy * 0.2, allenergy * 1.4, 7000, 7000, 0.3, 0.3, 100, 100, allenergy * 1.3),
                 VPPEnergyStorage(allenergy * 0.2, allenergy * 1.4, 3000, 5000, 0.3, 0.3, 10, 10, allenergy * 1.3)]
        res = opt(items, l, T, True)
        self.assertTrue(res[0])
        se = allenergy * 1.3
        res_test = np.array([se-5000*1.3,se-5000*1.3*2,se-5000*1.3*3, 0,0,0,5000,5000,5000,se-5000*1.3,se-5000*1.3*2,se-5000*1.3*3, 0,0,0,5000,5000,5000])
        self.assertTrue(np.all(np.round(res[1].x) == res_test), res[1].x) # The rounding is nessesary because the optimalizer working with some error

    # 2 ES with different costs (which can discharge less is the expensive one)
    def test_es_10(self):
        T=3
        l = np.full(T, 10000, dtype=np.float32)
        allenergy = np.sum(l)
        items = [VPPEnergyStorage(allenergy * 0.2, allenergy * 1.4, 7000, 7000, 0.3, 0.3, 10, 10, allenergy * 1.3),
                 VPPEnergyStorage(allenergy * 0.2, allenergy * 1.4, 5000, 5000, 0.3, 0.3, 100, 100, allenergy * 1.3)]
        res = opt(items, l, T, True)
        self.assertTrue(res[0])
        se = allenergy * 1.3
        res_test = np.array([se-7000*1.3,se-7000*1.3*2,se-7000*1.3*3, 0,0,0,7000,7000,7000,se-3000*1.3,se-3000*1.3*2,se-3000*1.3*3, 0,0,0,3000,3000,3000])
        self.assertTrue(np.all(np.round(res[1].x) == res_test), res[1].x) # The rounding is nessesary because the optimalizer working with some error

    # ==========================|
    # Test for only Solarpanels |
    # ==========================|

    #           |-------------------------|
    #           | Test for value checking |
    #           |-------------------------|

    # test r_max param
    def test_sp_params_1(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(-10, 10, 10, 10, 3))
    def test_sp_params_2(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel("a", 10, 10, 10, 3))
    # test delta_r_plus_max
    def test_sp_params_3(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, -10, 10, 10, 3))
    def test_sp_params_4(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, "a", 10, 10, 3))
    # test delta_r_minus_max
    def test_sp_params_5(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, 10, -10, 10, 3))
    def test_sp_params_6(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, 10, "a", 10, 3))
    # test cost param
    def test_sp_params_7(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, 10, 10, "a", 3))
    # test T param
    def test_sp_params_8(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, 10, 10, 10, -3))
    def test_sp_params_9(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, 10, 10, 10, "a"))
    # test r0 param
    def test_sp_params_10(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, 10, 10, 10, 3, "a"))
    #test shift_start param
    def test_sp_params_11(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, 10, 10, 10, 3, shift_start="a"))
    #test exp_v param
    def test_sp_params_12(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, 10, 10, 10, 3, exp_v="a"))
    #test range param
    def test_sp_params_13(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, 10, 10, 10, 3, range="a"))
    #test value_at_end param
    def test_sp_params_14(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, 10, 10, 10, 3, value_at_end="a"))
    #test addNoise param
    def test_sp_params_15(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, 10, 10, 10, 3, addNoise="a"))
    #test seed param
    def test_sp_params_16(self):
        self.assertRaises(Exception, lambda x: VPPSolarPanel(10, 10, 10, 10, 3, seed="a"))

    # Test exp_v, range
    def test_sp_1(self):
        T=5
        l = np.full(T, 10000, dtype=np.float32)
        items = [VPPSolarPanel(5000, 5001,5001,1,T, exp_v=2, range=2, addNoise=False),
                 VPPGasEngine(10000,10000, 10000, 100)]
        res = opt(items, l, T, True)
        self.assertTrue(res[0])
        x = res[1].x
        self.assertEqual(x[5], 10000, x)
        self.assertEqual(x[7], 5000, x)
        self.assertEqual(x[9], 10000, x)
        self.assertEqual(x[0], 0, x)
        self.assertEqual(x[2], 5000, x)
        self.assertEqual(x[4], 0, x)
    # test shift
    def test_sp_2(self):
        T=5
        l = np.full(T, 10000, dtype=np.float32)
        items = [VPPSolarPanel(5000, 5001,5001,1,T, exp_v=2, range=2, addNoise=False, shift_start=1),
                 VPPGasEngine(10000,10000, 10000, 100)]
        res = opt(items, l, T, True)
        self.assertTrue(res[0])
        x = res[1].x
        self.assertEqual(x[6], 5000, x)
        self.assertEqual(x[8], 10000, x)
        self.assertEqual(x[9], 10000, x)
        self.assertEqual(x[1], 5000, x)
        self.assertEqual(x[3], 0, x)
        self.assertEqual(x[4], 0, x)

    # ==========================|
    # Multi type generator test |
    # ==========================|
    # testing overproduction
    def test_multi_1(self):
        T=3
        l = np.full(T, 10000, dtype=np.float32)
        l[2] = 15000
        items = [VPPEnergyStorage(2000, 8000, 7000, 7000, 0.3, 0.3, 10, 10, 2000 + 4000*1.3-1000*0.7*2),
                 VPPGasEngine(11000,11000, 8000, 100)]
        res = opt(items, l, T, True)
        self.assertTrue(res[0])
        res_test = np.array([6500, 7200, 7200-4000*1.3, 1000, 1000,0, 0,0,4000, 11000, 11000, 11000])
        self.assertTrue(np.all(np.round(res[1].x) == res_test), res[1].x)
    # testing overproduction, but now the ES has much more energy stored
    def test_multi_2(self):
        T=3
        l = np.full(T, 10000, dtype=np.float32)
        items = [VPPEnergyStorage(2000, 11000, 7000, 7000, 0.3, 0.3, 10, 10, 11000),
                 VPPGasEngine(8000, 8000, 8000, 1000, 3000)]
        res = opt(items, l, T, True)
        self.assertTrue(res[0])
        res_test = np.array([7200, 2000+2000*1.3, 2000, 0, 0,0, math.floor(3800/1.3),2000,2000, math.ceil(10000-(3800/1.3)), 8000, 8000])
        self.assertTrue(np.all(np.round(res[1].x) == res_test), (res[1].x, res_test))
    # testing overproduction, but now with 2 GE and one of them has lover price so we expect
    # we except the GE with lower price will produce a lot of energy
    def test_multi_3(self):
        T=3
        l = np.full(T, 20000, dtype=np.float32)
        l[2] = 25000
        items = [VPPEnergyStorage(0, 11000, 7000, 7000, 0.3, 0.3, 10, 10, 2000),
                 VPPGasEngine(10000, 5000, 5000, 1000, 10000),
                 VPPGasEngine(12000, 5000, 5000, 10, 7000)]
        res = opt(items, l, T, True)
        self.assertTrue(res[0])
        res_test = np.array([2000+2000*0.7, 3000*1.3, 0, 2000, math.floor((3000*1.3-(2000+2000*0.7))/0.7),0, 0, 0, 3000, 
                             10000, 8000 + math.floor((3000*1.3-(2000+2000*0.7))/0.7),10000, 12000, 12000, 12000])
        self.assertTrue(np.all(np.round(res[1].x) == res_test), (np.round(res[1].x), res_test))

if __name__ == '__main__':
    unittest.main()
