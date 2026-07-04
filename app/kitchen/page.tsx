'use client';

import { useState } from 'react';
import { Download, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Skeleton } from '@/components/ui/skeleton';
import { Scrubber } from '@/components/ui/scrubber';
import { StatusBadge } from '@/components/ui/status-badge';
import { Modal } from '@/components/ui/modal';
import { Dropzone } from '@/components/ui/dropzone';
import { useToast } from '@/components/ui/toast';
import { RecTimer } from '@/components/motion/rec-timer';
import { RenderStage } from '@/components/motion/render-stage';
import { Wordmark } from '@/components/brand/logo';
import { videoStatusMeta, videoProgress } from '@/lib/status';
import { stageGradient } from '@/lib/thumb';
import { VIDEO_STATUSES } from '@pyrocut/shared';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="microlabel">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function KitchenPage() {
  const [modal, setModal] = useState(false);
  const [progress, setProgress] = useState(0.45);
  const toast = useToast();

  return (
    <div className="mx-auto max-w-[1000px] space-y-12 px-6 py-12">
      <header className="flex items-center justify-between">
        <Wordmark size={30} />
        <Chip tone="ember">/_kitchen</Chip>
      </header>

      <Section title="buttons">
        <Button>primary</Button>
        <Button variant="dark">dark</Button>
        <Button variant="outline">outline</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="danger">
          <Trash2 className="size-4" /> delete
        </Button>
        <Button loading>rendering</Button>
        <Button size="sm">small</Button>
        <Button size="lg">large cta →</Button>
      </Section>

      <Section title="chips / badges">
        <Chip>16:9</Chip>
        <Chip>9:16</Chip>
        <Chip tone="ember">snapcut</Chip>
        <Chip tone="dark">dolly</Chip>
        <Chip tone="neutral">editorial</Chip>
      </Section>

      <Section title="status dots (live stages)">
        {VIDEO_STATUSES.map((s) => (
          <StatusBadge key={s} meta={videoStatusMeta(s)} />
        ))}
      </Section>

      <Section title="rec timer (motion motif)">
        <div className="win-surface rounded-[var(--radius-win)] px-4 py-3">
          <RecTimer time="00:00:14" />
        </div>
      </Section>

      <section className="space-y-4">
        <h2 className="microlabel">ember scrubber (render progress)</h2>
        <Card className="space-y-4 p-6">
          <Scrubber value={progress} active />
          <div className="win-surface rounded-[var(--radius-win)] p-5">
            <Scrubber value={progress} active onDark />
          </div>
          <div className="flex gap-2">
            {[0, 0.25, 0.5, 0.8, 1].map((v) => (
              <Button
                key={v}
                size="sm"
                variant="outline"
                onClick={() => setProgress(v)}
              >
                {Math.round(v * 100)}%
              </Button>
            ))}
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="microlabel">render stage (waiting state)</h2>
        <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
          <div
            className="win-surface relative aspect-video overflow-hidden rounded-[var(--radius-card)] shadow-win"
            style={{ background: stageGradient('kitchen') }}
          >
            <RenderStage label="rendering" time="00:00:14" />
            <div className="absolute inset-x-8 bottom-7">
              <Scrubber value={0.8} active onDark />
            </div>
          </div>
          <div
            className="win-surface relative aspect-[9/16] overflow-hidden rounded-[var(--radius-card)] shadow-win"
            style={{ background: stageGradient('kitchen-compact') }}
          >
            <RenderStage label="generating" compact />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="microlabel">cards</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="win-surface relative flex aspect-video items-end p-4">
              <RecTimer
                time="00:00:09"
                className="absolute right-3 top-3"
              />
              <span className="text-sm text-white/70">dark thumbnail</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-2">
                <Chip>16:9</Chip>
                <Chip tone="ember">dolly</Chip>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" aria-label="download">
                  <Download className="size-4" />
                </Button>
                <Button size="sm" variant="ghost" aria-label="share">
                  <Share2 className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
          <Card className="space-y-3 p-6">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </Card>
        </div>
      </section>

      <Section title="overlays / inputs">
        <Button variant="dark" onClick={() => setModal(true)}>
          open modal
        </Button>
        <Button variant="outline" onClick={() => toast.success('saved', 'brand colors updated')}>
          toast success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error('render failed', 'try again')}
        >
          toast error
        </Button>
      </Section>

      <section className="space-y-4">
        <h2 className="microlabel">dropzone</h2>
        <Dropzone
          onFiles={(f) => toast.success(`${f.length} file(s)`, f[0]?.name)}
          hint="drop your logo or screenshots"
        />
      </section>

      <Modal
        open={modal}
        onOpenChange={setModal}
        title="delete this video?"
        description="this can’t be undone. the source project stays."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>
              cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setModal(false);
                toast.toast('video deleted');
              }}
            >
              delete
            </Button>
          </>
        }
      />

      <p className="microlabel pt-8">{videoProgress('rendering')}</p>
    </div>
  );
}
