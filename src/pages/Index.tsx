import { useState } from "react";
import { LocationPicker, LocationData } from "@/components/LocationPicker";
import { MapPin, Key, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [confirmedLocation, setConfirmedLocation] = useState<LocationData | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const handleConfirm = (location: LocationData) => {
    setConfirmedLocation(location);
    toast.success("Location confirmed!", {
      description: location.address.formattedAddress,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-4xl py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Location Picker</h1>
              <p className="text-sm text-muted-foreground">Google Maps Integration</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl py-8">
        {!showDemo ? (
          <div className="space-y-8">
            {/* Setup Instructions */}
            <div className="location-card">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Getting Started with Google Maps
              </h2>
              <p className="text-muted-foreground mb-6">
                Follow these steps to set up Google Maps integration for your app.
              </p>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Create a Google Cloud Project
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Go to the Google Cloud Console and create a new project or select an existing one.
                    </p>
                    <a
                      href="https://console.cloud.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Open Google Cloud Console
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Enable Required APIs
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Enable the following APIs in your Google Cloud project:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {["Maps JavaScript API", "Places API", "Geocoding API"].map((api) => (
                        <div
                          key={api}
                          className="flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-lg"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{api}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Create API Credentials
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Navigate to <strong>APIs & Services → Credentials</strong> and create an API key. 
                      Restrict it to your domain for security.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Enable Billing
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Google Maps requires billing to be enabled. You get $200 free monthly usage, 
                      which covers most use cases.
                    </p>
                    <div className="flex items-start gap-2 p-3 bg-accent/30 rounded-lg text-sm">
                      <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">
                        Set up budget alerts to avoid unexpected charges.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* API Key Input */}
            <div className="location-card">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                Try the Demo
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Enter your Google Maps API key to test the location picker component.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Google Maps API key"
                  className="flex-1 h-12 px-4 rounded-xl bg-search border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  onClick={() => setShowDemo(true)}
                  disabled={!apiKey.trim()}
                  className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Launch Demo
                </button>
              </div>
            </div>

            {/* API Response Data */}
            <div className="location-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Data You'll Receive
              </h3>
              <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
{`{
  "coordinates": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "address": {
    "formattedAddress": "123 Main St, New York, NY 10001",
    "streetNumber": "123",
    "route": "Main Street",
    "locality": "New York",
    "administrativeArea": "New York",
    "postalCode": "10001",
    "country": "United States",
    "premise": "Apt 4B"
  },
  "placeId": "ChIJd8BlQ2BZwokRAFUEcm_qrcA"
}`}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back button */}
            <button
              onClick={() => setShowDemo(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              ← Back to instructions
            </button>

            {/* Location Picker */}
            <LocationPicker
              apiKey={apiKey}
              defaultCenter={{ lat: 40.7128, lng: -74.006 }}
              onConfirm={handleConfirm}
            />

            {/* Confirmed Location Display */}
            {confirmedLocation && (
              <div className="location-card slide-up">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Confirmed Location Data
                </h3>
                <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-muted-foreground">
                    {JSON.stringify(confirmedLocation, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
