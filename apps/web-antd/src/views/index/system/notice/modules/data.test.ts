import { createPinia, setActivePinia } from 'pinia';
import { describe, expect, it } from 'vitest';

describe('notice form schema', () => {
  it('keeps the rich text editor component out of Vue reactivity', async () => {
    setActivePinia(createPinia());
    const { useFormSchema } = await import('./data');

    const contentSchema = useFormSchema().find(
      (schema) => schema.fieldName === 'content',
    );

    expect((contentSchema?.component as any)?.__v_skip).toBe(true);
  }, 30_000);
});
