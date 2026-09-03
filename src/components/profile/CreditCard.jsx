'use client';

import React from 'react';
import {
  Box,
  Text,
  Flex,
  HStack,
  VStack,
} from '@chakra-ui/react';
import CreditInfoTooltip from './CreditInfoTooltip.jsx';
import { getCreditTooltip } from './creditTooltipDescriptions.js';

export const CreditCard = ({ item }) => {
  const {
    id,
    name,
    used = 0,
    total = 0,
    isUnlimited,
    icon: Icon,
  } = item;

  const tooltipDescription = getCreditTooltip(id, name);
  const isUnlimitedMode = Boolean(isUnlimited);

  const percentage =
    !isUnlimitedMode && total > 0
      ? Math.min(100, Math.round((used / total) * 100))
      : 0;

  const remaining = !isUnlimitedMode
    ? Math.max(0, total - used)
    : Infinity;

  let semanticColor = '#10b981';
  let statusBadgeText = 'Optimal';

  if (!isUnlimitedMode) {
    if (percentage > 90) {
      semanticColor = '#ef4444';
      statusBadgeText = 'Critical';
    } else if (percentage > 75) {
      semanticColor = '#f97316';
      statusBadgeText = 'High';
    } else if (percentage > 50) {
      semanticColor = '#f59e0b';
      statusBadgeText = 'Moderate';
    }
  } else {
    semanticColor = '#60a5fa';
    statusBadgeText = 'Optimal';
  }

  return (
    <Box
      borderRadius="md"
      bg="var(--bg-card, #131a12)"
      border="1px solid"
      borderColor="var(--border-card, #243022)"
      boxShadow="0 1px 4px rgba(0, 0, 0, 0.2)"
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        borderColor: semanticColor,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 6px ${semanticColor}25`,
        transform: 'translateY(-1px)',
      }}
      position="relative"
      overflow="hidden"
      height="100%"
      p="7px 10px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      gap="4px"
    >
      {/* Top Accent line */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="2px"
        bg={semanticColor}
        opacity={0.85}
      />

      {/* Row 1: [Credit Icon] Credit Name (Left) | [Info Icon] (Right) */}
      <Flex align="center" justify="space-between" width="100%" gap={1.5}>
        <HStack gap={1.5} align="center" flex="1" minW={0}>
          <Flex
            align="center"
            justify="center"
            w="18px"
            h="18px"
            borderRadius="4px"
            bg="var(--bg-sidebar, #0a0d0a)"
            border="1px solid"
            borderColor="var(--border, #1a2217)"
            color={semanticColor}
            flexShrink={0}
          >
            {Icon && <Icon size={11} />}
          </Flex>

          <Text
            fontSize="10.5px"
            fontWeight="700"
            color="var(--text-primary, #ffffff)"
            lineHeight="1.2"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
            flex="1"
            minW={0}
            title={name}
          >
            {name}
          </Text>
        </HStack>

        <Box flexShrink={0} display="flex" alignItems="center">
          <CreditInfoTooltip
            description={tooltipDescription}
            creditName={name}
          />
        </Box>
      </Flex>

      {/* Row 2: Main Credit Numbers (Used / Total vs Remaining) */}
      <Flex align="baseline" justify="space-between" width="100%" mt="1px">
        <Box display="flex" alignItems="baseline">
          {isUnlimitedMode ? (
            <Text
              fontSize="12.5px"
              fontWeight="800"
              color="#60a5fa"
              lineHeight="1.1"
              letterSpacing="-0.01em"
            >
              Unlimited
            </Text>
          ) : (
            <>
              <Text
                as="span"
                fontSize="13px"
                fontWeight="800"
                color="var(--text-primary, #ffffff)"
                lineHeight="1.1"
                letterSpacing="-0.01em"
              >
                {used.toLocaleString()}
              </Text>
              <Text
                as="span"
                fontSize="10.5px"
                fontWeight="600"
                color="var(--text-muted, #72826c)"
                lineHeight="1.1"
                ml="3px"
              >
                / {total.toLocaleString()}
              </Text>
            </>
          )}
        </Box>

        <Text
          fontSize="9.5px"
          color="var(--text-muted, #72826c)"
          fontWeight="500"
          lineHeight="1.1"
        >
          {isUnlimitedMode ? 'No Limit' : `${remaining.toLocaleString()} remaining`}
        </Text>
      </Flex>

      {/* Row 3 & 4: Progress Bar + Status / Used % */}
      <VStack gap="2px" align="stretch" width="100%">
        {/* Row 3: Compact Progress Bar */}
        <Box
          h="3.5px"
          w="100%"
          bg={isUnlimitedMode ? 'rgba(96, 165, 250, 0.12)' : 'var(--border, #1a2217)'}
          borderRadius="full"
          overflow="hidden"
          my="1px"
        >
          <Box
            h="100%"
            w={isUnlimitedMode ? '100%' : `${percentage}%`}
            bg={isUnlimitedMode ? 'linear-gradient(90deg, #60a5fa, #22d3ee)' : semanticColor}
            borderRadius="full"
            transition="width 0.5s ease"
          />
        </Box>

        {/* Row 4: Status Label (Left) | Percentage Used (Right) */}
        <Flex justify="space-between" align="center" width="100%">
          <Text fontSize="8.5px" fontWeight="500" color="var(--text-muted, #72826c)" lineHeight="1">
            {statusBadgeText}
          </Text>

          <Text
            fontSize="8.5px"
            fontWeight="600"
            color={isUnlimitedMode ? '#60a5fa' : semanticColor}
            lineHeight="1"
          >
            {isUnlimitedMode ? 'Unlimited' : `${percentage}% Used`}
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default CreditCard;
