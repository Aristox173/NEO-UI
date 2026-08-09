# neo-ui

Librería de componentes Angular, documentada con Storybook. En desarrollo — ver [`blueprint`](docs/) y los ADRs en `docs/adr/`.

> Estado: fase 0 (walking skeleton). Todavía no hay versión publicada en npm ni Storybook desplegado.

## Estructura

- `projects/ui/` — la librería que se publica como `neo-ui`.
- `projects/playground/` — app interna para probar el paquete empaquetado (no el código fuente).

## Desarrollo

```bash
ng build ui        # compila la librería a dist/ui
ng serve playground # levanta la app de prueba
```

## Licencia

MIT — ver [LICENSE](LICENSE).
