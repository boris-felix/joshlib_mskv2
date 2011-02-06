#!/bin/sh

cd js/josh
JSDOCDIR="../../build/jsdoc-toolkit"

OPTIONS=" -Djsdoc.dir=$JSDOCDIR -Djsdoc.template.dir=$JSDOCDIR/templates/jsdoc/"

rm -rf ../../docs/jsdoc-html/*
CMD="java $OPTIONS -jar $JSDOCDIR/jsrun.jar $JSDOCDIR/app/run.js --template=../../docs/src/_themes/jsdoc-tably -d=../../docs/jsdoc-html/ -r=10  -c=../../build/jsdoc.conf ."
echo $CMD
$CMD

rm -rf ../../docs/src/jsdoc/*
CMD="java $OPTIONS -jar $JSDOCDIR/jsrun.jar $JSDOCDIR/app/run.js --template=../../docs/src/_themes/jsdoc-rst -d=../../docs/src/jsdoc/ -x=js,jsx -r=10  -c=../../build/jsdoc.conf ."
echo $CMD
$CMD