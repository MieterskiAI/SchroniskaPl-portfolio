# Portfolio audit (TL;DR)

## Strengths
- End‑to‑end data pipeline (CSV → JSON → API → UI) pokazuje realny przepływ danych.
- Czytelny podział na backend / dane / frontend ułatwia szybkie zrozumienie projektu.
- Praktyczne endpointy API (lista, szczegóły, drzewo regionów, nearest).

## Gaps
- UX w UI wymaga szybszego wglądu w skalę danych i wyniki filtrów.
- Brak krótkiego „dlaczego to portfolio” i planu rozwoju w jednym miejscu.
- Brak automatycznych checków w CI.

## Roadmap (1 ekran)
1. **UX**: statystyki, filtrowanie po regionach, paginacja / „load more”.
2. **Dokumentacja**: krótki audit + roadmap w README.
3. **Jakość**: CI (npm ci + lint/test jeśli są) + proste diagramy architektury.
