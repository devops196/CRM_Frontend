import React from 'react';
import {
  ChakraProvider,
  defaultSystem,
  Box,
  SimpleGrid,
  Heading,
  Text,
  Flex,
  Badge,
  HStack,
  VStack,
} from '@chakra-ui/react';
import {
  Sparkles,
  Video,
  Mic,
  AudioWaveform,
  BarChart3,
  UserCheck,
  Image,
  Film,
  Bot,
  Briefcase,
  Users,
  Zap,
} from 'lucide-react';
import CreditCard from './CreditCard';
import type { CreditCardItem } from './CreditCard';
import type { TeamMember } from '../../types/team';

export interface UsageCreditsDashboardProps {
  dbUserCredits?: {
    available: number;
    total: number;
  };
  user?: Partial<TeamMember> | any;
  renewalDate?: string;
  /** Optional: name of the user whose credits are shown (for Team Lookup context) */
  userName?: string;
}

export const UsageCreditsDashboard: React.FC<UsageCreditsDashboardProps> = ({
  dbUserCredits,
  user,
  renewalDate = '15/07/2026',
  userName,
}) => {
  const userObj = user || {};
  const totalCredits = userObj.totalCredits ?? dbUserCredits?.total ?? 0;
  const availableCredits = userObj.creditsAvailable ?? dbUserCredits?.available ?? 0;
  const genUsedCalc = Math.max(0, totalCredits - availableCredits);

  // Define all 11 credit metrics dynamically connected to PostgreSQL data
  const creditItems: CreditCardItem[] = [
    {
      id: 'generation_credits',
      name: 'Generation Credits',
      used: userObj.generationCreditsUsed ?? userObj.generationcreditsused ?? genUsedCalc,
      total: userObj.generationCreditsTotal ?? userObj.generationcreditstotal ?? totalCredits,
      icon: Sparkles,
      tooltip: 'Used for AI text, copy, and ad content generation',
      category: 'AI Engine',
    },
    {
      id: 'video_credits',
      name: 'Video Credits',
      used: userObj.videoCreditsUsed ?? userObj.videocreditsused ?? 0,
      total: userObj.videoCreditsTotal ?? userObj.videocreditstotal ?? 0,
      icon: Video,
      tooltip: 'Used for full AI video generation & rendering',
      category: 'Video',
    },
    {
      id: 'voice_credits',
      name: 'Voice Credits',
      used: userObj.voiceCreditsUsed ?? userObj.voicecreditsused ?? 0,
      total: userObj.voiceCreditsTotal ?? userObj.voicecreditstotal ?? 0,
      icon: Mic,
      tooltip: 'Used for text-to-speech voiceover generation',
      category: 'Audio',
    },
    {
      id: 'voice_clone_credits',
      name: 'Voice Clone Credits',
      used: userObj.voiceCloneCreditsUsed ?? userObj.voiceclonecreditsused ?? 0,
      total: userObj.voiceCloneCreditsTotal ?? userObj.voiceclonecreditstotal ?? 0,
      icon: AudioWaveform,
      tooltip: 'Used for custom voice cloning models',
      category: 'Audio',
    },
    {
      id: 'analysis_credits',
      name: 'Analysis Credits',
      used: 0,
      total: 0,
      isUnlimited: userObj.analysisCreditsUnlimited ?? userObj.analysiscreditsunlimited ?? true,
      icon: BarChart3,
      tooltip: 'Unlimited AI workspace performance and risk analytics',
      category: 'Analytics',
    },
    {
      id: 'ugc_credits',
      name: 'UGC Credits',
      used: userObj.ugcCreditsUsed ?? userObj.ugccreditsused ?? 0,
      total: userObj.ugcCreditsTotal ?? userObj.ugccreditstotal ?? 0,
      icon: UserCheck,
      tooltip: 'Used for User Generated Content AI creator avatars',
      category: 'Creative',
    },
    {
      id: 'image_credits',
      name: 'Image Credits',
      used: userObj.imageCreditsUsed ?? userObj.imagecreditsused ?? 0,
      total: userObj.imageCreditsTotal ?? userObj.imagecreditstotal ?? 0,
      icon: Image,
      tooltip: 'Used for AI image generation and enhancement',
      category: 'Creative',
    },
    {
      id: 'image_to_video_credits',
      name: 'Image to Video Credits',
      used: userObj.imageToVideoCreditsUsed ?? userObj.imagetovideocreditsused ?? 0,
      total: userObj.imageToVideoCreditsTotal ?? userObj.imagetovideocreditstotal ?? 0,
      icon: Film,
      tooltip: 'Used for transforming static images into motion video',
      category: 'Video',
    },
    {
      id: 'ai_video_credits',
      name: 'AI Video Credits',
      used: userObj.aiVideoCreditsUsed ?? userObj.aivideocreditsused ?? 0,
      total: userObj.aiVideoCreditsTotal ?? userObj.aivideocreditstotal ?? 0,
      icon: Bot,
      tooltip: 'Used for advanced multi-scene AI video synthesis',
      category: 'Video',
    },
    {
      id: 'brands_created',
      name: 'Brands Created',
      used: userObj.brandsCreated ?? userObj.brandscreated ?? 0,
      total: userObj.brandsLimit ?? userObj.brandslimit ?? 0,
      icon: Briefcase,
      tooltip: 'Active brand profiles managed in workspace',
      category: 'Workspace',
    },
    {
      id: 'users_added',
      name: 'Users Added',
      used: userObj.usersAdded ?? userObj.usersadded ?? 0,
      total: userObj.usersLimit ?? userObj.userslimit ?? 0,
      icon: Users,
      tooltip: 'Team member seats currently assigned',
      category: 'Seats',
    },
  ];

  const displayName = userName || userObj.name;

  return (
    <ChakraProvider value={defaultSystem}>
      <Box
        bg="var(--bg-surface, #0e120d)"
        border="1px solid"
        borderColor="var(--border, #1a2217)"
        borderRadius="xl"
        p={{ base: 3, md: 4 }}
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.35)"
        display="flex"
        flexDirection="column"
        gap={3}
      >
        {/* Section Header */}
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'start', sm: 'center' }}
          gap={3}
        >
          <VStack align="start" gap={0.5}>
            <HStack gap={1.5}>
              <Zap size={16} style={{ color: 'var(--primary, #ccff00)' }} />
              <Heading size="sm" color="var(--text-primary, #ffffff)" fontFamily="var(--font-display)" fontWeight="800">
                Usage & Credits
              </Heading>
            </HStack>
            <Text fontSize="11px" color="var(--text-muted, #889882)">
              Real-time usage breakdown across all subscription AI modules.
            </Text>
          </VStack>

          <HStack gap={2} flexWrap="wrap">
            {displayName && (
              <Badge
                px={2.5}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="700"
                bg="rgba(204, 255, 0, 0.1)"
                border="1px solid"
                borderColor="rgba(204, 255, 0, 0.3)"
                color="var(--primary, #ccff00)"
              >
                {displayName}
              </Badge>
            )}
            <Badge
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="700"
              bg="var(--bg-sidebar, #0a0d0a)"
              border="1px solid"
              borderColor="var(--border, #1a2217)"
              color="var(--text-secondary, #a3b19e)"
            >
              Billing Cycle ends: <Text as="span" color="var(--primary, #ccff00)" fontWeight="800">{renewalDate}</Text>
            </Badge>
          </HStack>
        </Flex>

        {/* Section Divider */}
        <Box height="1px" bg="var(--border, #1a2217)" width="100%" />

        {/* Responsive SimpleGrid Layout:
            Desktop: 4 per row (lg: 4)
            Tablet: 2 per row (md: 2)
            Mobile: 1 per row (base: 1)
        */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={2.5}>
          {creditItems.map((item) => (
            <CreditCard key={item.id} item={item} />
          ))}
        </SimpleGrid>
      </Box>
    </ChakraProvider>
  );
};

export default UsageCreditsDashboard;
