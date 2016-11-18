#duplicate all tracks from any layer to any other layer:
tries:
- replace `^((.*)(layer F.Mask)(.*\n))` with `$&#Dup$&`. This matches all the lines we want to change and copies them prepending a #Dup to each duplicated line, the new lines are commented so they don't cause harm
- then replace `#Dup([\W\w]*?)layer F\.Mask([\W\w]*?)$`  with  `#Dup:\n$1layer F.Cu$2`