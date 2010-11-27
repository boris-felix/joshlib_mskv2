#!/bin/sh

cd js/josh
JSDOCDIR="../../build/jsdoc-toolkit"

CMD="java -Djsdoc.dir=$JSDOCDIR -Djsdoc.template.dir=$JSDOCDIR/templates/jsdoc/ -jar $JSDOCDIR/jsrun.jar $JSDOCDIR/app/run.js -d=../../docs/ -r=10 ."
echo $CMD
$CMD