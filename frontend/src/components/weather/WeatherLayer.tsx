import useWeather from './useWeather';

const DEFAULT_WEATHER_LOCATION = {
  latitude: 39.5,
  longitude: -3,
};

function WindIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M3 8h11a3 3 0 1 0-3-3" />
      <path d="M3 12h15a3 3 0 1 1-3 3" />
      <path d="M3 16h8a3 3 0 1 0-3 3" />
    </svg>
  );
}

function TemperatureIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0Z" />
      <path d="M12 12V6" />
    </svg>
  );
}

function HumidityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M12 3.5S6 10 6 14a6 6 0 0 0 12 0c0-4-6-10.5-6-10.5Z" />
      <path d="M9.5 15.5a2.7 2.7 0 0 0 2.5 1.5" />
    </svg>
  );
}

function getWindDirectionLabel(
  degrees: number | null,
): string {
  if (degrees === null) {
    return 'Sin datos';
  }

  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSO',
    'SO',
    'OSO',
    'O',
    'ONO',
    'NO',
    'NNO',
  ];

  const normalizedDegrees =
    ((degrees % 360) + 360) % 360;

  const index = Math.round(
    normalizedDegrees / 22.5,
  ) % 16;

  return directions[index];
}

function formatTemperature(
  temperature: number | null,
): string {
  if (temperature === null) {
    return '—';
  }

  return `${Math.round(temperature)}°`;
}

function formatWindSpeed(
  windSpeed: number | null,
): string {
  if (windSpeed === null) {
    return '—';
  }

  return `${windSpeed.toFixed(1)} m/s`;
}

function formatObservedAt(
  observedAt: string | null,
): string {
  if (!observedAt) {
    return 'Sin fecha disponible';
  }

  const date = new Date(observedAt);

  if (Number.isNaN(date.getTime())) {
    return 'Fecha no disponible';
  }

  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

interface WeatherLayerProps {
  enabled: boolean;
}

export default function WeatherLayer({
  enabled,
}: WeatherLayerProps) {
  const {
    weather,
    loading,
    error,
    lastUpdated,
    refresh,
  } = useWeather({
    latitude: DEFAULT_WEATHER_LOCATION.latitude,
    longitude: DEFAULT_WEATHER_LOCATION.longitude,
    enabled,
  });

  if (!enabled) {
    return null;
  }

  return (
    <div
      className="
        pointer-events-none absolute bottom-5 left-4 z-[1000]
        w-[min(360px,calc(100%-2rem))]
      "
    >
      <section
        aria-label="Condiciones meteorológicas"
        className="
          pointer-events-auto overflow-hidden rounded-3xl
          border border-white/70 bg-white/90
          shadow-[0_16px_40px_rgba(15,23,42,0.24)]
          backdrop-blur-xl
        "
      >
        <div
          className="
            flex items-center justify-between
            border-b border-slate-200/80
            px-4 py-3
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-2xl bg-blue-50 text-blue-600
              "
            >
              <WindIcon />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Condiciones meteorológicas
              </h2>

              <p className="text-[11px] text-slate-400">
                Zona centro del mapa
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            aria-label="Actualizar datos meteorológicos"
            title="Actualizar datos meteorológicos"
            className="
              rounded-xl p-2 text-slate-400
              transition-colors duration-200
              hover:bg-slate-100 hover:text-blue-600
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={[
                'h-4 w-4',
                loading ? 'animate-spin' : '',
              ].join(' ')}
            >
              <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
              <path d="M4 4v5h5" />
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
              <path d="M20 20v-5h-5" />
            </svg>
          </button>
        </div>

        {loading && !weather && (
          <div
            className="flex items-center gap-3 px-4 py-5"
            role="status"
            aria-live="polite"
          >
            <span
              className="
                h-5 w-5 animate-spin rounded-full
                border-2 border-blue-200 border-t-blue-600
              "
            />

            <span className="text-xs text-slate-500">
              Cargando datos meteorológicos…
            </span>
          </div>
        )}

        {error && !weather && (
          <div
            className="px-4 py-4"
            role="alert"
            aria-live="assertive"
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full bg-red-500"
                aria-hidden="true"
              />

              <p className="text-xs font-semibold text-red-700">
                No se han podido cargar los datos
              </p>
            </div>

            <p className="text-xs leading-relaxed text-slate-500">
              Comprueba que el backend está activo y que
              OpenWeather responde correctamente.
            </p>

            <button
              type="button"
              onClick={refresh}
              className="
                mt-3 rounded-xl bg-red-50 px-3 py-2
                text-xs font-semibold text-red-700
                transition-colors hover:bg-red-100
              "
            >
              Reintentar
            </button>
          </div>
        )}

        {weather && (
          <div className="px-4 py-4">
            <div className="mb-4 flex items-end justify-between">
              <div className="flex items-center gap-2">
                <TemperatureIcon />

                <span className="text-4xl font-bold tracking-tight text-slate-900">
                  {formatTemperature(weather.temperature)}
                </span>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold capitalize text-slate-700">
                  {weather.weatherDescription ??
                    'Condición no disponible'}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Sensación{' '}
                  {weather.feelsLike !== null
                    ? `${Math.round(weather.feelsLike)}°`
                    : '—'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div
                className="
                  rounded-2xl bg-slate-50/90 px-3 py-3
                "
              >
                <div className="mb-2 flex items-center gap-2 text-blue-600">
                  <WindIcon />

                  <span className="text-[11px] font-semibold uppercase tracking-wide">
                    Viento
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-800">
                  {formatWindSpeed(weather.windSpeed)}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  {getWindDirectionLabel(
                    weather.windDirection,
                  )}

                  {weather.windDirection !== null &&
                    ` · ${Math.round(weather.windDirection)}°`}
                </p>
              </div>

              <div
                className="
                  rounded-2xl bg-slate-50/90 px-3 py-3
                "
              >
                <div className="mb-2 flex items-center gap-2 text-cyan-600">
                  <HumidityIcon />

                  <span className="text-[11px] font-semibold uppercase tracking-wide">
                    Humedad
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-800">
                  {weather.humidity !== null
                    ? `${Math.round(weather.humidity)}%`
                    : '—'}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Humedad relativa
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                Observado a las{' '}
                {formatObservedAt(weather.observedAt)}
              </p>

              {lastUpdated && (
                <span
                  className="
                    flex items-center gap-1.5
                    text-[11px] font-medium text-emerald-600
                  "
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                    aria-hidden="true"
                  />

                  Actualizado
                </span>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}