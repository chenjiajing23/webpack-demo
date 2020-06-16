#!/bin/sh

echo "  ✔ Running field block..."

for FILE in $(git diff-index -p -M --name-status HEAD -- | cut -c3-); do
    if [[ ${FILE} == "src/"* ]]; then
        grep --color -HEnio 'TODO|FIXME|DEBUGGER' $FILE
    fi
done

echo "    End field block"

exit
