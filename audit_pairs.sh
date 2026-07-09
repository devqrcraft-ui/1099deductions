#!/bin/bash
pairs=(
amazon-flex-california amazon-flex-texas
doordash-california doordash-florida doordash-illinois doordash-new-york doordash-texas
grubhub-california grubhub-florida grubhub-new-york grubhub-texas
handyman
instacart-california instacart-florida instacart-new-york instacart-texas
lyft-california lyft-florida lyft-new-york lyft-texas
rover shipt taskrabbit
uber-california uber-florida uber-illinois uber-new-york uber-texas
walmart-spark
)

printf "%-28s %10s %10s %6s %6s %8s %8s\n" "PAIR" "BASE_CHR" "NEW_CHR" "B_H2" "N_H2" "B_SCHEMA" "N_SCHEMA"
for p in "${pairs[@]}"; do
  b="deductions/$p/index.html"
  n="deductions/$p-2026/index.html"
  if [[ -f "$b" && -f "$n" ]]; then
    bc=$(sed -e 's/<[^>]*>//g' "$b" | tr -d '[:space:]' | wc -c)
    nc=$(sed -e 's/<[^>]*>//g' "$n" | tr -d '[:space:]' | wc -c)
    bh2=$(grep -c "<h2" "$b")
    nh2=$(grep -c "<h2" "$n")
    bschema=$(grep -oE '"@type":"[A-Za-z]+"' "$b" | wc -l)
    nschema=$(grep -oE '"@type":"[A-Za-z]+"' "$n" | wc -l)
    printf "%-28s %10s %10s %6s %6s %8s %8s\n" "$p" "$bc" "$nc" "$bh2" "$nh2" "$bschema" "$nschema"
  else
    printf "%-28s MISSING (base=%s new=%s)\n" "$p" "$( [[ -f $b ]] && echo ok || echo NO )" "$( [[ -f $n ]] && echo ok || echo NO )"
  fi
done
