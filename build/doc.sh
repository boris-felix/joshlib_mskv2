#!/bin/sh


sh build/jsdoc.sh
wkhtmltopdf docs/jsdoc-html/*.html docs/jsdoc-html/symbols/*.html docs/jsdoc-pdf/JoshlibApiReference.pdf
make -f build/Makefile-sphinx html

#make -f build/Makefile-sphinx latexpdf
