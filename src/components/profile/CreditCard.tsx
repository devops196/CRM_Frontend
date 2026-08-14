
import React from 'react';
import {
  Box,
  Text,
  Badge,
  Flex,
  HStack,
  VStack,
} from '@chakra-ui/react';
import type { LucideIcon } from 'lucide-react';
import CreditInfoTooltip from './CreditInfoTooltip';
import { getCreditTooltip } from './creditTooltipDescriptions';

export interface CreditCardItem {
  id: string;
  name: string;
  used: number;
  total: number;
  isUnlimited?: boolean;
  icon: LucideIcon;
  tooltip?: string;
  category?: string;
}

interface CreditCardProps {
  item: CreditCardItem;
}

export const CreditCard: React.FC<CreditCardProps> = ({ item }) => {
  const {
    id,
    name,
    used,
    total,
    isUnlimited,
    icon: Icon,
    category,
  } = item;

  const tooltipDescription = getCreditTooltip(id, name);

  const isUnlimitedMode = Boolean(isUnlimited);

  // Safe calculation: Usage Percentage = (Used / Total) * 100
  const percentage =
    !isUnlimitedMode && total > 0
      ? Math.min(100, Math.round((used / total) * 100))
      : 0;

  // Remaining = Total - Used
  const remaining = !isUnlimitedMode
    ? Math.max(0, total - used)
    : Infinity;

  // Status Rules:
  // 0–50% → Optimal
  // 51–75% → Moderate
  // 76–90% → High
  // 91–100% → Critical

  let semanticColor = '#10b981';
  let statusBadgeText = 'Optimal';
  let badgeBg = 'rgba(16, 185, 129, 0.18)';
  let badgeTextColor = '#34d399';

  if (!isUnlimitedMode) {
    if (percentage > 90) {
      semanticColor = '#ef4444';
      statusBadgeText = 'Critical';
      badgeBg = 'rgba(239, 68, 68, 0.18)';
      badgeTextColor = '#f87171';
    } else if (percentage > 75) {
      semanticColor = '#f97316';
      statusBadgeText = 'High';
      badgeBg = 'rgba(249, 115, 22, 0.18)';
      badgeTextColor = '#fb923c';
    } else if (percentage > 50) {
      semanticColor = '#f59e0b';
      statusBadgeText = 'Moderate';
      badgeBg = 'rgba(245, 158, 11, 0.18)';
      badgeTextColor = '#fbbf24';
    }
  } else {
    // Unlimited state
    statusBadgeText = 'Unlimited';
    badgeBg = 'rgba(59, 130, 246, 0.18)';
    badgeTextColor = '#60a5fa';
  }

  return (
    <Box
      borderRadius="lg"
      bg="var(--bg-card, #131a12)"
      border="1px solid"
      borderColor="var(--border-card, #243022)"
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.25)"
      transition="all 0.22s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: `0 6px 18px rgba(0, 0, 0, 0.4), 0 0 8px ${semanticColor}35`,
        borderColor: semanticColor,
      }}
      position="relative"
      overflow="hidden"
      height="100%"
      p={3}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      {/* Top accent bar */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="2px"
        bg={semanticColor}
        opacity={0.9}
      />

      {/* Row 1: Icon + Name + Badge */}
      <Flex
        align="center"
        justify="space-between"
        width="100%"
      >
        <HStack gap={2}>
          <Flex
            align="center"
            justify="center"
            w="28px"
            h="28px"
            borderRadius="md"
            bg="var(--bg-sidebar, #0a0d0a)"
            border="1px solid"
            borderColor="var(--border, #1a2217)"
            color={semanticColor}
            flexShrink={0}
          >
            <Icon size={14} />
          </Flex>

          <VStack
            align="start"
            gap={0}
          >
            {/* Credit name + info tooltip */}
            <HStack
              gap={1}
              align="center"
              wrap="nowrap"
            >
              <Text
                fontSize="11px"
                fontWeight="700"
                color="var(--text-primary, #ffffff)"
                lineHeight="1.2"
                lineClamp={1}
              >
                {name}
              </Text>

              <CreditInfoTooltip
                description={tooltipDescription}
                creditName={name}
              />
            </HStack>

            {category && (
              <Text
                fontSize="9px"
                color="var(--text-muted, #889882)"
                textTransform="uppercase"
                fontWeight="600"
                lineHeight="1.2"
              >
                {category}
              </Text>
            )}
          </VStack>
        </HStack>

        {/* Usage badge */}
        <Badge
          px={1.5}
          py={0}
          borderRadius="full"
          fontSize="9px"
          fontWeight="700"
          bg={badgeBg}
          color={badgeTextColor}
          textTransform="none"
          flexShrink={0}
        >
          {isUnlimitedMode
            ? 'Unlimited'
            : `${percentage}%`}
        </Badge>
      </Flex>

      {/* Row 2: Used / Total + Remaining */}
      <Flex
        align="baseline"
        justify={isUnlimitedMode ? 'center' : 'space-between'}
        gap={1}
        width="100%"
      >
        <HStack
          gap={1}
          align="baseline"
          justify={isUnlimitedMode ? 'center' : 'flex-start'}
        >
          <Text
            fontSize={isUnlimitedMode ? 'lg' : 'sm'}
            fontWeight="800"
            color={
              isUnlimitedMode
                ? '#60a5fa'
                : 'var(--text-primary, #ffffff)'
            }
            letterSpacing="-0.02em"
            lineHeight="1"
            textAlign={isUnlimitedMode ? 'center' : 'left'}
          >
            {isUnlimitedMode
              ? 'Unlimited'
              : used.toLocaleString()}
          </Text>

          {!isUnlimitedMode && (
            <Text
              fontSize="10px"
              color="var(--text-muted, #889882)"
              fontWeight="600"
            >
              / {total.toLocaleString()}
            </Text>
          )}
        </HStack>

        {!isUnlimitedMode && (
          <Text
            fontSize="10px"
            color="var(--text-muted, #889882)"
            fontWeight="600"
          >
            {remaining.toLocaleString()} remaining
          </Text>
        )}
      </Flex>

      {/* Row 3: Unlimited indicator OR normal progress bar */}
      <Box
        width="100%"
        mt={isUnlimitedMode ? 3 : 0}
      >
        {isUnlimitedMode ? (
          <VStack
            gap={1}
            align="stretch"
            width="100%"
          >
            {/* Unique Unlimited progress indicator */}
            <Box
              h="5px"
              w="100%"
              bg="rgba(96, 165, 250, 0.12)"
              borderRadius="full"
              overflow="hidden"
            >
              <Box
                h="100%"
                w="100%"
                bg="linear-gradient(90deg, #60a5fa, #22d3ee, #60a5fa)"
                borderRadius="full"
                boxShadow="0 0 8px rgba(96, 165, 250, 0.45)"
              />
            </Box>

            {/* Unlimited status */}
            <Flex
              justify="space-between"
              align="center"
            >
              <Text
                fontSize="9px"
                fontWeight="600"
                color="var(--text-muted, #889882)"
              >
                Unlimited
              </Text>

              <Text
                fontSize="9px"
                fontWeight="700"
                color="#60a5fa"
              >
                No Limit
              </Text>
            </Flex>
          </VStack>
        ) : (
          <VStack
            gap={0.5}
            align="stretch"
            width="100%"
          >
            {/* Normal progress bar */}
            <Box
              h="4px"
              w="100%"
              bg="var(--border, #1a2217)"
              borderRadius="full"
              overflow="hidden"
            >
              <Box
                h="100%"
                w={`${percentage}%`}
                bg={semanticColor}
                borderRadius="full"
                transition="width 0.8s ease-in-out"
              />
            </Box>

            {/* Status + Percentage */}
            <Flex
              justify="space-between"
              align="center"
            >
              <Text
                fontSize="9px"
                color="var(--text-muted, #889882)"
              >
                {statusBadgeText}
              </Text>

              <Text
                fontSize="9px"
                fontWeight="700"
                color={semanticColor}
              >
                {percentage}% Used
              </Text>
            </Flex>
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default CreditCard;
