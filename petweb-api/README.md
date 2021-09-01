<!-- <br><br><br> -->

# TF_DirectSN

Previously developed codes for tensorflow 1.x.x. Please check the **requirements.txt**

# TF_DirectSN_tf25

Reorganized codes with tensorflow 2.5.0. It supports cuda 11.2 and cudnn 8.1.

It also containes the pyinstaller for pakaging deep learing api. Please check the **eval_cyc_coregpy_F18.spec**

- Pakaging with encryption:
```bash
pyinstller eval_cyc_coregpy_F18.spec
```

- You can change the encryption key by changing  **eval_cyc_coregpy_F18.spec**
- You should install `tinyaes` first
```bash
pip instsall tinyaes
```
- After then, change the **eval_cyc_coregpy_F18.spec**
```bash
block_cipher = pyi_crypto.PyiBlockCipher(key=[YOUR_OWN_KEY])
```

- You can pakage all codes to ONEFILE.
```bash
pyinstller -F eval_cyc_coregpy_F18.spec
```
