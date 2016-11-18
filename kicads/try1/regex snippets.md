#duplicate all tracks from any layer to any other layer:
tries:
- replace `^((.*)(layer F.Mask)(.*\n))` with `$&#Dup$&`. This matches all the lines we want to change and copies them prepending a #Dup to each duplicated line, the new lines are commented so they don't cause harm
- then replace `#Dup([\W\w]*?)layer F\.Mask([\W\w]*?)$`  with  `#Dup:\n$1layer F.Cu$2`
- now commented all the layer FMask lines, because I don't need them at the end. they are there commented for the case of needing to change them to solder paste or something