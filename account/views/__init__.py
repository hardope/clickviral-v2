import os

files = os.listdir(os.path.dirname(__file__))
__all__ = [file[:-3] for file in files if file.endswith('.py') and file != '__init__.py']

for file in __all__:
    exec(f'from .{file} import *')