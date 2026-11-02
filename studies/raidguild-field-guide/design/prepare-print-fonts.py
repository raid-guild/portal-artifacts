"""Convert first-party Louchi web fonts into static TTFs for ReportLab.

Requires fonttools and brotli; the web build uses the original WOFF2 files.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

fonts = Path(__file__).resolve().parents[1] / 'fonts'
for cut in ('Regular', 'Retalic'):
    source = fonts / f'Grinder-Refined-{cut}.woff2'
    destination = fonts / f'Grinder-Refined-{cut}.ttf'
    face = TTFont(source)
    face.flavor = None
    face.save(destination)

for weight, name in ((400, 'Regular'), (700, 'Bold')):
    face = TTFont(fonts / 'Ubuntu-Variable.ttf')
    instantiateVariableFont(face, {'wght': weight}, inplace=True)
    face.save(fonts / f'Ubuntu-{name}.ttf')

print('Prepared static Louchi fonts for the print PDF')
