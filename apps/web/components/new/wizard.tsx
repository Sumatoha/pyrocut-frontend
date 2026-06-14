'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Brand, Format, Plan, Preset } from '@pyrocut/shared';
import { api, ApiError } from '@/lib/client/api';
import { DEMO_MODE } from '@/lib/client/demo';
import { useProject } from '@/lib/client/use-project';
import { useToast } from '@/components/ui/toast';
import { Stepper } from './stepper';
import { StepUrl } from './step-url';
import { StepBrand } from './step-brand';
import { StepFormat } from './step-format';
import { StepGenerate } from './step-generate';

function guessKind(name: string): 'logo' | 'screenshot' {
  return /logo|mark|brand/i.test(name) ? 'logo' : 'screenshot';
}

/** /new — мастер из 4 шагов (§4). */
export function Wizard({ plan }: { plan: Plan }) {
  const router = useRouter();
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [url, setUrl] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [format, setFormat] = useState<Format>('16:9');

  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { project } = useProject(step >= 1 ? projectId : null);

  function errMsg(e: unknown): string | undefined {
    return e instanceof ApiError ? e.message : undefined;
  }

  async function handleUrl(nextUrl: string, brief: string) {
    setUrl(nextUrl);
    setCreating(true);
    try {
      if (DEMO_MODE) {
        setProjectId(`demo-project-${Date.now()}`);
      } else {
        const p = await api.createProject({
          url: nextUrl,
          brief: brief || undefined,
        });
        setProjectId(p.id);
      }
      setStep(1);
    } catch (e) {
      toast.error('could not start', errMsg(e) ?? 'is the backend running?');
    } finally {
      setCreating(false);
    }
  }

  async function handleUpload(files: File[]) {
    if (DEMO_MODE) {
      toast.success(`${files.length} file(s) added (demo)`);
      return;
    }
    if (!projectId) return;
    setUploading(true);
    try {
      for (const f of files) {
        await api.uploadAsset(projectId, f, guessKind(f.name));
      }
      toast.success('uploaded', `${files.length} file(s)`);
    } catch (e) {
      toast.error('upload failed', errMsg(e));
    } finally {
      setUploading(false);
    }
  }

  async function handleConfirmBrand(brand: Brand) {
    if (!DEMO_MODE && projectId) {
      try {
        await api.patchProject(projectId, brand);
      } catch (e) {
        toast.error('could not save brand edits', errMsg(e));
      }
    }
    setStep(2);
  }

  async function handleGenerate(f: Format, preset: Preset, prompt: string) {
    setFormat(f);
    setGenerating(true);
    try {
      if (DEMO_MODE) {
        setVideoId(`demo-video-${Date.now()}`);
      } else {
        if (!projectId) throw new Error('no project');
        const v = await api.createVideo({
          projectId,
          format: f,
          preset,
          prompt: prompt || undefined,
        });
        setVideoId(v.id);
      }
      setStep(3);
    } catch (e) {
      if (e instanceof ApiError && e.isPaymentRequired) {
        toast.error('out of credits', 'taking you to billing');
        router.push('/billing');
      } else {
        toast.error('could not generate', errMsg(e));
      }
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-10 py-2">
      <Stepper current={step} />

      {step === 0 && <StepUrl onSubmit={handleUrl} loading={creating} />}

      {step === 1 && (
        <StepBrand
          project={project}
          url={url}
          uploading={uploading}
          onUpload={handleUpload}
          onConfirm={handleConfirmBrand}
          onBack={() => {
            setProjectId(null);
            setStep(0);
          }}
        />
      )}

      {step === 2 && (
        <StepFormat
          generating={generating}
          onBack={() => setStep(1)}
          onGenerate={handleGenerate}
        />
      )}

      {step === 3 && (
        <StepGenerate
          videoId={videoId}
          format={format}
          plan={plan}
          onRetry={() => {
            setVideoId(null);
            setStep(2);
          }}
        />
      )}
    </div>
  );
}
