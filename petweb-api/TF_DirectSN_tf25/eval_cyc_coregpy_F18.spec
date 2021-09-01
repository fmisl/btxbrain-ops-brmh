# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import collect_data_files

datas = []
datas += collect_data_files('dipy')


block_cipher = pyi_crypto.PyiBlockCipher(key='123412342341234')


a = Analysis(['eval_cyc_coregpy_F18.py'],
             pathex=['D:\\Workspace\\Venv\\py37-tf25\\Lib\\site-packages', 'D:\\Workspace\\Studies\\petweb_back_test\\TF_DirectSN'],
             binaries=[],
             datas=datas,
             hiddenimports=['dipy.*', 'dipy.utils.omp', 'dipy.segment.cythonutils', 'keras.api._v1', 'keras.engine.base_layer_v1', 'keras'],
             hookspath=[],
             hooksconfig={},
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)

exe = EXE(pyz,
          a.scripts, 
          [],
          exclude_binaries=True,
          name='eval_cyc_coregpy_F18',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=True,
          disable_windowed_traceback=False,
          target_arch=None,
          codesign_identity=None,
          entitlements_file=None )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas, 
               strip=False,
               upx=True,
               upx_exclude=[],
               name='eval_cyc_coregpy_F18')
