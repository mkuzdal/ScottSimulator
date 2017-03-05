#!/bin/bash

for file in $(find $1 -name '*.mtl')
do
  mv $file $(echo "$file" | sed -r 's|.mtl|_material.txt|g')
done
