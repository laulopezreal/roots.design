import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCart } from "./cart/CartContext";
import CloudinaryImage from "./CloudinaryImage";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

const PAYMENT_DELAY_MS = 1200;

const CartPage = () => {
  const cart = useCart();

  if (!cart.enabled) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-32 pb-16 px-4 md:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center space-y-4">
            <h1 className="text-3xl font-light text-gray-900">Cart Unavailable</h1>
            <p className="text-sm text-gray-500">
              The shopping cart and checkout are currently disabled. Please check back soon or continue exploring the collection.
            </p>
            <Button asChild>
              <Link to="/">Browse The Collection</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const { items, subtotal, updateQuantity, removeItem, clearCart } = cart;
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiration: "",
    cvc: "",
  });

  const totals = useMemo(() => {
    const shipping = items.length > 0 ? 25 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      shipping,
      tax,
      total,
    };
  }, [items.length, subtotal]);

  const handleQuantityChange = (id: string, value: string) => {
    const parsedValue = Number.parseInt(value, 10);
    if (Number.isNaN(parsedValue)) {
      return;
    }

    updateQuantity(id, Math.max(1, parsedValue));
  };

  const handlePayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!items.length || isProcessing) {
      return;
    }

    setIsProcessing(true);

    window.setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      clearCart();
    }, PAYMENT_DELAY_MS);
  };

  const handleFieldChange = (field: keyof typeof formValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormValues((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));
    };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[2fr_1fr]">
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 space-y-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900">Shopping Cart</h1>
              <p className="mt-2 text-sm text-gray-500">
                Review your selections, adjust quantities, and complete your purchase
                when you&apos;re ready.
              </p>
            </div>

            {paymentComplete ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-3">
                <h2 className="text-xl font-light text-green-900">Payment successful</h2>
                <p className="text-sm text-green-800">
                  Thank you for your order. A confirmation email has been sent to
                  <span className="font-medium"> {formValues.email || "your inbox"}</span>.
                </p>
                <div>
                  <Button asChild variant="outline" className="mt-2">
                    <Link to="/">Continue exploring</Link>
                  </Button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center space-y-4">
                <p className="text-gray-600">Your cart is currently empty.</p>
                <Button asChild>
                  <Link to="/">Browse The Collection</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-6 last:border-none"
                  >
                    {item.image ? (
                      <CloudinaryImage
                        {...item.image}
                        alt={item.image.alt || item.name}
                        className="w-full md:w-40 h-40 object-cover rounded-lg"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="w-full md:w-40 h-40 rounded-lg bg-gray-100"
                      />
                    )}
                    <div className="flex-1 space-y-4">
                      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-light text-gray-900">{item.name}</h3>
                          {item.brand && (
                            <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                              {item.brand}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-gray-500">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          className="self-start text-sm text-gray-500 hover:text-gray-900"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </Button>
                      </header>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <label className="text-sm text-gray-600" htmlFor={`qty-${item.id}`}>
                          Quantity
                        </label>
                        <Input
                          id={`qty-${item.id}`}
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) =>
                            handleQuantityChange(item.id, event.target.value)
                          }
                          className="w-24"
                        />
                        <p className="sm:ml-auto text-base font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h2 className="text-xl font-light text-gray-900">Order summary</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{totals.shipping === 0 ? "Complimentary" : formatCurrency(totals.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-4 text-base font-medium text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>

            {!paymentComplete && (
              <form
                onSubmit={handlePayment}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4"
              >
                <h2 className="text-xl font-light text-gray-900">Payment details</h2>
                <p className="text-sm text-gray-500">
                  Enter your billing information to complete the purchase.
                </p>
                <Input
                  value={formValues.name}
                  onChange={handleFieldChange("name")}
                  placeholder="Full name"
                  autoComplete="name"
                  required
                  disabled={!items.length || isProcessing}
                />
                <Input
                  type="email"
                  value={formValues.email}
                  onChange={handleFieldChange("email")}
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  disabled={!items.length || isProcessing}
                />
                <Input
                  value={formValues.cardNumber}
                  onChange={handleFieldChange("cardNumber")}
                  placeholder="Card number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  required
                  disabled={!items.length || isProcessing}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    value={formValues.expiration}
                    onChange={handleFieldChange("expiration")}
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    required
                    disabled={!items.length || isProcessing}
                  />
                  <Input
                    value={formValues.cvc}
                    onChange={handleFieldChange("cvc")}
                    placeholder="CVC"
                    autoComplete="cc-csc"
                    required
                    disabled={!items.length || isProcessing}
                  />
                </div>
                <Button type="submit" disabled={!items.length || isProcessing} className="w-full">
                  {isProcessing ? "Processing payment..." : `Pay ${formatCurrency(totals.total)}`}
                </Button>
              </form>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
