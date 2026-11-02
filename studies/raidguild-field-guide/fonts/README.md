# Last Duel display font provenance

Louchi supplied the six Last Duel OTF cuts in `source/`. This Field Guide uses Ex2 and BoldEx2 for display, Oblique and BoldOblique for italic display, and the distinct Ex2Retalic and BoldEx2Retalic for expressive accents. The web files are WOFF2; print uses TrueType-outline TTFs derived from the same source. All cuts use native 400/700 weights with no synthetic bold or skew.

The conversion is documented by `design/prepare-print-fonts.py`. Install the pinned dependencies in `design/requirements-fonts.txt` before running it. The supplied commercial files remain tied to this guide and outside a reusable package. Ubuntu and Ubuntu Mono serve body and utility roles under their own Ubuntu Font Licence. The native Ubuntu italic variable font serves italic body copy on web; the converter also derives static italic and bold-italic TTFs for ReportLab. Historical Grinder files remain archived but are no longer loaded.
