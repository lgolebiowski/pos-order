import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/cart-context';
import { getItemCount, getLineTotal, getTotal } from '@/features/cart/totals';
import { fontSize, spacing, useThemeColors } from '@/theme/theme';

import { useSubmitOrder } from './use-submit-order';

const backToMenu = () => router.dismissTo('/order');

export function OrderSummaryScreen() {
  const colors = useThemeColors();
  const { cart } = useCart();
  const { state, submit, reset } = useSubmitOrder();
  const [simulateFailure, setSimulateFailure] = useState(false);

  if (state.status === 'success') {
    const { confirmation } = state;
    return (
      <View style={[styles.page, { backgroundColor: colors.background }]}>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.foreground }]}>
          Order placed!
        </Text>
        <Text style={[styles.description, { color: colors.muted }]}>
          Thanks, the canteen has your order.
        </Text>

        <View style={styles.details}>
          <Text style={[styles.label, { color: colors.muted }]}>Order number</Text>
          <Text style={[styles.value, { color: colors.foreground }]}>{confirmation.orderId}</Text>
          <Text style={[styles.label, { color: colors.muted }]}>Total</Text>
          <Text style={[styles.value, { color: colors.foreground }]}>
            ${confirmation.total.toFixed(2)} · {confirmation.itemCount}{' '}
            {confirmation.itemCount === 1 ? 'item' : 'items'}
          </Text>
        </View>

        <Button title="Start new order" variant="primary" fullWidth onPress={backToMenu} />
      </View>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <View style={[styles.page, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Your order is empty.</Text>
        <Text style={[styles.description, { color: colors.muted }]}>
          Add something from the menu first.
        </Text>
        <Button title="Back to menu" variant="primary" onPress={backToMenu} />
      </View>
    );
  }

  const isSubmitting = state.status === 'submitting';

  function toggleSimulateFailure(value: boolean) {
    setSimulateFailure(value);
    // The error came from the simulated failure; switching it off dismisses it.
    if (!value && state.status === 'error') reset();
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        style={styles.list}
        data={cart.lines}
        keyExtractor={(line) => line.product.id}
        renderItem={({ item: line }) => (
          <View style={[styles.line, { borderBottomColor: colors.divider }]}>
            <View style={styles.lineDetails}>
              <Text style={[styles.lineName, { color: colors.foreground }]}>
                {line.product.name}
              </Text>
              <Text style={[styles.lineQuantity, { color: colors.muted }]}>
                {line.quantity} × ${line.product.price.toFixed(2)}
              </Text>
            </View>
            <Text style={[styles.lineTotal, { color: colors.foreground }]}>
              ${getLineTotal(line).toFixed(2)}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.totals}>
            <Text style={[styles.itemCount, { color: colors.muted }]}>
              Items: {getItemCount(cart)}
            </Text>
            <Text style={[styles.total, { color: colors.foreground }]}>
              Total: ${getTotal(cart).toFixed(2)}
            </Text>
          </View>
        }
      />

      <SafeAreaView
        edges={['bottom']}
        style={[styles.footer, { borderTopColor: colors.divider, backgroundColor: colors.background }]}
      >
        {state.status === 'error' && (
          <View accessible accessibilityRole="alert">
            <Text style={[styles.error, { color: colors.danger }]}>
              Couldn&apos;t submit your order. {state.message}
            </Text>
            <Text style={[styles.error, { color: colors.danger }]}>
              Your items are still in the order.
            </Text>
          </View>
        )}

        {isSubmitting ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.muted} accessibilityLabel="Submitting order" />
            <Text style={[styles.loadingText, { color: colors.muted }]}>
              Submitting your order…
            </Text>
          </View>
        ) : null}

        <View style={styles.toggle}>
          <Text style={[styles.toggleLabel, { color: colors.foreground }]}>
            Simulate failed request
          </Text>
          <Switch
            accessibilityLabel="Simulate failed request"
            value={simulateFailure}
            onValueChange={toggleSimulateFailure}
            disabled={isSubmitting}
            // iOS passes `disabled` straight to the native switch; state it for accessibility too.
            accessibilityState={{ disabled: isSubmitting, checked: simulateFailure }}
            trackColor={{ true: colors.dangerFill }}
          />
        </View>

        <Button
          title={
            simulateFailure
              ? 'Submit order failed'
              : state.status === 'error'
                ? 'Try again'
                : 'Submit order'
          }
          variant={simulateFailure ? 'danger' : 'primary'}
          fullWidth
          disabled={isSubmitting}
          onPress={() => void submit({ simulateFailure })}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: spacing.page,
    paddingTop: spacing.page * 2,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '600',
  },
  description: {
    marginTop: spacing.sm,
    marginBottom: spacing.page,
    fontSize: fontSize.base,
  },
  details: {
    alignSelf: 'stretch',
    marginBottom: spacing.page,
  },
  label: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
  },
  value: {
    fontSize: fontSize.base,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.page,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lineDetails: {
    flex: 1,
    gap: 2,
  },
  lineName: {
    fontSize: fontSize.base,
    fontWeight: '500',
  },
  lineQuantity: {
    fontSize: fontSize.sm,
    fontVariant: ['tabular-nums'],
  },
  lineTotal: {
    fontSize: fontSize.base,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  totals: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    paddingHorizontal: spacing.page,
    paddingVertical: spacing.lg,
  },
  itemCount: {
    fontSize: fontSize.sm,
  },
  total: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  footer: {
    gap: spacing.md,
    paddingHorizontal: spacing.page,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  error: {
    fontSize: fontSize.sm,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: fontSize.sm,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  toggleLabel: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
});
