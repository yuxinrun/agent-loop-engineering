import { useCountUp } from '../lib/hooks';
import { useLang } from '../i18n/LangContext';

type StatProps = {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub: string;
  accent?: string;
};

function Stat({ target, prefix = '', suffix = '', label, sub, accent }: StatProps) {
  const { ref, value } = useCountUp(target);
  return (
    <div className="group relative px-4 py-5 text-center sm:px-5 sm:py-6">
      <div className="stat-number text-2xl sm:text-[1.7rem]" style={accent ? { color: accent } : undefined}>
        <span>{prefix}</span>
        <span ref={ref}>{value}</span>
        <span>{suffix}</span>
      </div>
      <div className="mt-1.5 text-[0.74rem] font-semibold text-[var(--text)]">{label}</div>
      <div className="mt-0.5 text-[0.63rem] leading-snug text-[var(--muted)]">{sub}</div>
    </div>
  );
}

export function StatsBand() {
  const { t } = useLang();

  return (
    <div className="container-x pb-10 pt-2">
      <div className="grid grid-cols-2 divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-sm)] md:grid-cols-4 md:divide-x md:divide-y-0">
        <Stat
          target={128}
          suffix="K"
          label={t('典型上下文窗口', 'Typical context window')}
          sub={t('不是免费的饭桌', 'Not a free lunch')}
          accent="var(--primary-strong)"
        />
        <Stat
          target={100}
          prefix="50–"
          label={t('建议 max_turns 起步', 'Suggested max_turns')}
          sub={t('先小后大，按任务调', 'Start small, tune later')}
        />
        <Stat
          target={177}
          label={t('一次真实失控 trace', 'One runaway trace')}
          sub="spans · AWS AgentCore"
          accent="var(--accent)"
        />
        <Stat
          target={3}
          suffix="×"
          label={t('相同调用触发熔断', 'Repeat calls trip the fuse')}
          sub={t('tool + args hash', 'tool + args hash')}
          accent="var(--teal)"
        />
      </div>
    </div>
  );
}
