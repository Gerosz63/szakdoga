import unittest
import requests
from optimizer import VPPGasEngine, VPPEnergyStorage, VPPSolarPanel, solve 
import json
import numpy as np

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
class TestAPISolarData(unittest.TestCase):
    def test_no_input(self):
        response = requests.get(api_url_solardata, params=params)
        results = response.json()
        self.assertFalse(results["success"])

    def test_false_data(self):
        params = {"dt" : ""}
        response = requests.get(api_url_solardata, params=params)
        results = response.json()
        self.assertFalse(results["success"])

    def test_partial_data(self):
        test_data_SP["exp_v"] = None
        params = {"data" : json.dumps(test_data_SP)}
        response = requests.get(api_url_solardata, params=params)
        results = response.json()
        self.assertFalse(results["success"])

    def test_wrong_type(self):
        test_data_SP["exp_v"] = "apple"
        params = {"data" : json.dumps(test_data_SP)}
        response = requests.get(api_url_solardata, params=params)
        results = response.json()
        self.assertFalse(results["success"])

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

class TestAPISolve(unittest.TestCase):    
    def test_no_input(self):
        response = requests.get(api_url_solve, params=params)
        results = response.json()
        self.assertFalse(results["success"])
        self.assertEqual(results["result"], "Hiba történt!")

    def test_false_data(self):
        params = {"dt" : ""}
        response = requests.get(api_url_solve, params=params)
        results = response.json()
        self.assertFalse(results["success"])
        self.assertEqual(results["result"], "Hiba történt!")
    
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

    def test_good_inp(self):
        test_data_S_ = test_data_S.copy()
        params = {"data" : json.dumps(test_data_S_)}
        response = requests.get(api_url_solve, params=params)
        results = response.json()
        self.assertTrue(results["success"],test_data_S_)
        for e in results["result"]:
            self.assertEqual(e,1)

class TestOptimezer(unittest.TestCase):

    def test_ge_1(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 1010, 10)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertFalse(opt(items, l, T))


    def test_ge_2(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 1010, 10000)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertTrue(opt(items, l, T))

    def test_ge_3(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 1010)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertTrue(opt(items, l, T))

    def test_ge_4(self):
        T=3
        items = [VPPGasEngine(10000, 1000, 1000, 1330, 10000)]
        l = np.full(T, 10000, dtype=np.float32)
        l[1] = 15000
        self.assertFalse(opt(items, l, T))

    def test_ge_5(self):
        T=3
        items = [VPPGasEngine(10000, 5000, 5000, 1010, 10000)]
        l = np.full(T, 10000, dtype=np.float32)
        l[1] = 15000
        self.assertFalse(opt(items, l, T))

    def test_ge_6(self):
        T=3
        items = [VPPGasEngine(15000, 5000, 5000, 1010, 10000)]
        l = np.full(T, 10000, dtype=np.float32)
        l[1] = 15000
        self.assertTrue(opt(items, l, T))

    def test_ge_6(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 1010)]
        l = np.array([100, 143, 125], dtype=np.float32)
        self.assertTrue(opt(items, l, T))

    def test_ge_7(self):
        T=3
        items = [VPPGasEngine(10000, 5000, 5000, 1010, 20000)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertTrue(opt(items, l, T))

    def test_ge_8(self):
        T=3
        items = [VPPGasEngine(10000, 50, 50, 1010, 175)]
        l = np.array([175, 226, 300], dtype=np.float32)
        self.assertFalse(opt(items, l, T))

    def test_ge_9(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 1010, 10), VPPGasEngine(10000, 100, 100, 1010, 10)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertFalse(opt(items, l, T))

    def test_ge_10(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 100), VPPGasEngine(10000, 100, 100, 100)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertTrue(opt(items, l, T))

    def test_ge_11(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 100, 5000), VPPGasEngine(10000, 100, 100, 100, 5000)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertTrue(opt(items, l, T))

    def test_ge_12(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 100), VPPGasEngine(10000, 100, 100, 100, 5000)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertTrue(opt(items, l, T))

    def test_ge_13(self):
        T=3
        items = [VPPGasEngine(10000, 100, 100, 500), VPPGasEngine(10000, 100, 100, 100, 5000)]
        l = np.full(T, 10000, dtype=np.float32)
        self.assertTrue(opt(items, l, T))



if __name__ == '__main__':
    unittest.main()