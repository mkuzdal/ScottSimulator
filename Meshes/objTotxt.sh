#!/bin/bash

for file in $(find $1 -name '*.obj')
do
  mv $file $(echo "$file" | sed -r 's|.obj|.txt|g')
done
