/**
 * Centralized tooltip descriptions for all credit/usage metric types.
 *
 * These are keyed by the `CreditCardItem.id` field so any component can
 * look up the description without hardcoding it inline.
 *
 * Add new credit types here — they will automatically propagate to every
 * place that renders a CreditCard (Usage & Credits section + Team Lookup).
 */
export const CREDIT_TOOLTIP_DESCRIPTIONS: Record<string, string> = {
  generation_credits:
    'Credits used for AI-powered content generation, including ad copy, captions, and creative text.',
  video_credits:
    'Credits consumed when generating full AI videos, including rendering and post-processing.',
  voice_credits:
    'Credits used for AI voice generation, such as text-to-speech voiceovers for ads and videos.',
  voice_clone_credits:
    'Credits used for cloning a specific voice to create a personalised AI voice model.',
  analysis_credits:
    'Credits used for AI analysis features such as performance insights and risk analytics. This feature currently has no usage limit.',
  ugc_credits:
    'Credits used for generating UGC-style (User Generated Content) creative content with AI avatars.',
  image_credits:
    'Credits consumed when generating or enhancing AI images for ads and creative assets.',
  image_to_video_credits:
    'Credits used when converting static images into animated or motion video content.',
  ai_video_credits:
    'Credits used for advanced AI video generation, including multi-scene synthesis and effects.',
  brands_created:
    `Number of brand profiles created within this workspace relative to the plan's allowed brand limit.`,
  users_added:
    `Number of users or seats added to this workspace relative to the plan's allowed user limit.`,
};

/**
 * Returns the tooltip description for a given credit ID, falling back to a
 * generic description so dynamically-added credit types always have a label.
 */
export function getCreditTooltip(creditId: string, creditName: string): string {
  return (
    CREDIT_TOOLTIP_DESCRIPTIONS[creditId] ??
    `Credits used for ${creditName.toLowerCase()} within your subscription plan.`
  );
}
