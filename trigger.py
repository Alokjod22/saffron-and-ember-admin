import urllib.request
import json

url = "https://api.render.com/v1/services/srv-dakfmnrm8hqs73eeoqhg/deploys"
headers = {
    "Authorization": "Bearer rnd_i21PH9wzvYQVTy8GwvWhvDgu0KsE",
    "Accept": "application/json",
    "Content-Type": "application/json"
}
data = json.dumps({"clearCache": "do_not_clear"}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers=headers, method="POST")
try:
    with urllib.request.urlopen(req) as response:
        res = response.read().decode('utf-8')
        print("Deploy Triggered:", res)
        with open("trigger_res.json", "w") as f:
            f.write(res)
except Exception as e:
    print("Error:", e)
    with open("trigger_res.json", "w") as f:
        f.write(str(e))
