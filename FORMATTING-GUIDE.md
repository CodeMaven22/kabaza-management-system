# Formatting Utilities Guide - Malawi Kwacha (MWK)

## Overview

The `lib/utils.ts` file now includes comprehensive formatting utilities for displaying data in the Kabaza Management System, with special focus on Malawi Kwacha currency formatting.

---

## Currency Formatting

### `formatCurrency(amount, showSymbol)`

Formats amounts in Malawi Kwacha with proper localization.

**Parameters:**
- `amount` (number | string): The amount to format
- `showSymbol` (boolean): Whether to show "MK" prefix (default: true)

**Examples:**

```typescript
import { formatCurrency } from '@/lib/utils'

formatCurrency(1234.56)           // "MK 1,234.56"
formatCurrency(1234.56, false)    // "1,234.56"
formatCurrency("5000")            // "MK 5,000.00"
formatCurrency(0)                 // "MK 0.00"
formatCurrency("invalid")         // "MK 0.00" (handles errors gracefully)
```

**Use Cases:**
- Payment amounts
- Fine amounts
- Revenue totals
- Invoice totals
- Account balances

**In Components:**

```tsx
import { formatCurrency } from '@/lib/utils'

export function PaymentDisplay({ amount }: { amount: number }) {
  return (
    <div className="text-lg font-semibold">
      Amount: {formatCurrency(amount)}
    </div>
  )
}

// Display in table cells
<TableCell>{formatCurrency(payment.amount)}</TableCell>

// Display in cards
<div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
```

---

## Date Formatting

### `formatDate(date, formatStr)`

Formats dates in a readable format.

**Parameters:**
- `date` (Date | string): The date to format
- `formatStr` (string): Format string using date-fns patterns (default: "MMM dd, yyyy")

**Examples:**

```typescript
import { formatDate } from '@/lib/utils'

formatDate(new Date())                    // "Jan 15, 2024"
formatDate("2024-01-15")                  // "Jan 15, 2024"
formatDate(new Date(), "dd/MM/yyyy")      // "15/01/2024"
formatDate(new Date(), "EEEE, MMMM d")    // "Monday, January 15"
```

**Common Format Strings:**
- `"MMM dd, yyyy"` - Jan 15, 2024
- `"dd/MM/yyyy"` - 15/01/2024
- `"yyyy-MM-dd"` - 2024-01-15
- `"EEEE, MMMM d, yyyy"` - Monday, January 15, 2024

**In Components:**

```tsx
import { formatDate } from '@/lib/utils'

<TableCell>{formatDate(payment.createdAt)}</TableCell>

<div className="text-sm text-gray-600">
  Payment Date: {formatDate(payment.date)}
</div>
```

---

## DateTime Formatting

### `formatDateTime(date)`

Formats both date and time in a readable format.

**Parameters:**
- `date` (Date | string): The date/time to format

**Examples:**

```typescript
import { formatDateTime } from '@/lib/utils'

formatDateTime(new Date())        // "Jan 15, 2024 at 2:30 PM"
formatDateTime("2024-01-15T14:30:00")  // "Jan 15, 2024 at 2:30 PM"
```

**In Components:**

```tsx
import { formatDateTime } from '@/lib/utils'

<div className="text-sm">
  Last updated: {formatDateTime(payment.updatedAt)}
</div>
```

---

## Phone Number Formatting

### `formatPhoneNumber(phone)`

Formats Malawi phone numbers in a readable format.

**Parameters:**
- `phone` (string): Phone number string

**Examples:**

```typescript
import { formatPhoneNumber } from '@/lib/utils'

formatPhoneNumber("265987654321")        // "+265 9 87654321"
formatPhoneNumber("0987654321")          // "0 9 87654321"
formatPhoneNumber("+265987654321")       // "+265 9 87654321"
```

**In Components:**

```tsx
import { formatPhoneNumber } from '@/lib/utils'

<TableCell>{formatPhoneNumber(owner.phone)}</TableCell>

<div className="text-sm">
  Contact: {formatPhoneNumber(operator.phoneNumber)}
</div>
```

---

## Text Truncation

### `truncateText(text, length)`

Truncates text with ellipsis at specified length.

**Parameters:**
- `text` (string): Text to truncate
- `length` (number): Maximum length (default: 50)

**Examples:**

```typescript
import { truncateText } from '@/lib/utils'

truncateText("This is a very long description", 15)    // "This is a very ..."
truncateText("Short text", 50)                          // "Short text" (no change)
truncateText(description, 25)                           // "This is a very long ..."
```

**In Components:**

```tsx
import { truncateText } from '@/lib/utils'

<TableCell>{truncateText(payment.description, 40)}</TableCell>

<p className="text-sm text-gray-600">
  {truncateText(note, 100)}
</p>
```

---

## Real-World Usage Examples

### Financial Table Display

```tsx
import { formatCurrency, formatDate } from '@/lib/utils'

function PaymentsTable({ payments }) {
  return (
    <Table>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{formatDate(payment.date)}</TableCell>
            <TableCell>{payment.reference}</TableCell>
            <TableCell className="text-right font-semibold">
              {formatCurrency(payment.amount)}
            </TableCell>
            <TableCell>
              <Badge>{payment.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### Financial Dashboard Card

```tsx
import { formatCurrency, formatDate } from '@/lib/utils'

function RevenueCard({ totalRevenue, lastUpdate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {formatCurrency(totalRevenue)}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Last updated: {formatDate(lastUpdate)}
        </p>
      </CardContent>
    </Card>
  )
}
```

### Owner Information Display

```tsx
import { formatPhoneNumber, formatDate } from '@/lib/utils'

function OwnerCard({ owner }) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm text-gray-600">Name</p>
        <p className="font-semibold">{owner.firstName} {owner.lastName}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Phone</p>
        <p className="font-semibold">{formatPhoneNumber(owner.phone)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Registration Date</p>
        <p className="font-semibold">{formatDate(owner.registeredAt)}</p>
      </div>
    </div>
  )
}
```

---

## Error Handling

All formatting functions include robust error handling:

- Invalid amounts default to "MK 0.00"
- Invalid dates display "Invalid date"
- Invalid phone numbers return the original input
- All functions include try-catch blocks for safety

---

## Best Practices

1. **Always use `formatCurrency` for monetary values** - Never display raw numbers for currency
2. **Use consistent date formats** - Stick to one format across your app
3. **Format at display time** - Keep raw values in state, format when rendering
4. **Import once per file** - Import all needed formatters at the top of your component

**Example:**

```tsx
// ✅ Good
import { formatCurrency, formatDate, formatPhoneNumber } from '@/lib/utils'

export function Payment({ payment }) {
  return (
    <>
      <p>{formatCurrency(payment.amount)}</p>
      <p>{formatDate(payment.date)}</p>
      <p>{formatPhoneNumber(payment.phone)}</p>
    </>
  )
}

// ❌ Bad - Formatting in state
export function Payment({ payment }) {
  const [displayAmount] = useState(formatCurrency(payment.amount))
  // This breaks reactivity and uses memory unnecessarily
}
```

---

## Adding New Formatters

To add a new formatter function:

1. Open `lib/utils.ts`
2. Add your function after the existing formatters
3. Include JSDoc comments
4. Add error handling with try-catch
5. Export the function
6. Document usage in this file

**Template:**

```typescript
/**
 * Brief description of what this formatter does
 * @param input - Description of input
 * @param option - Optional parameter description
 * @returns Description of output
 */
export function formatSomething(input: string, option?: string): string {
  try {
    // Your formatting logic
    return formatted
  } catch (error) {
    console.error('[v0] Error formatting:', error)
    return 'Error' // or default value
  }
}
```

---

## Testing Formatters

Always test with edge cases:

```typescript
// Currency
formatCurrency(0)
formatCurrency(-1000)
formatCurrency(1000000)
formatCurrency("invalid")

// Dates
formatDate("invalid date")
formatDate(new Date("invalid"))
formatDate("")

// Phone
formatPhoneNumber("")
formatPhoneNumber("123")
formatPhoneNumber("invalid")
```

---

## Currency Localization

The currency formatter uses Malawi locale (`en-MW`). To change locale:

```typescript
// In formatCurrency function, change:
new Intl.NumberFormat('en-MW', { ... })

// To:
new Intl.NumberFormat('en-US', { ... })  // US format
new Intl.NumberFormat('en-GB', { ... })  // UK format
new Intl.NumberFormat('pt-BR', { ... })  // Brazilian format
```

---

## Performance Tips

- Formatters are pure functions - results can be memoized
- Use `useMemo` for formatting large lists:

```tsx
const formattedPayments = useMemo(
  () => payments.map(p => ({
    ...p,
    displayAmount: formatCurrency(p.amount)
  })),
  [payments]
)
```

---

For questions or to add new formatters, refer to the main REQUIREMENTS.md or SETUP.md files.
