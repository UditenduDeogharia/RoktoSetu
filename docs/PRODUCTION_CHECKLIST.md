# RaktoSetu Production Checklist (Steps 6–10)

## 6. Production environment
Set these only in the hosting provider's environment-variable settings, never in Git:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (if Maps is enabled)
- FCM credentials/secrets must remain server-side; never expose service-account private keys as `NEXT_PUBLIC_*`.

## 7. Push notifications
1. Create/register the app in Firebase.
2. Enable Firebase Cloud Messaging.
3. Add the client Firebase configuration to the app.
4. Request notification permission.
5. Register the FCM device token through Supabase `register_device_token`.
6. Send push messages from a trusted server/Edge Function using server-side Firebase credentials.
7. Test normal, urgent, and emergency notifications on a physical device.

## 8. Maps
1. Enable the required Google Maps APIs.
2. Create a browser-restricted Maps key.
3. Restrict allowed APIs and production domains.
4. Store it as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in the deployment environment.
5. Keep verified map places in `map_places` and never expose unverified locations as verified.

## 9. Monitoring
- Use Supabase logs/metrics for backend monitoring.
- Add a frontend error-monitoring provider before launch (e.g. Sentry or Crashlytics depending on platform).
- Review `security_audit_events` and `production_test_runs` from the admin dashboard.
- Monitor notification failures, matching failures, SOS events, and database errors.

## 10. Final end-to-end test
Run with separate test requester, donor, organization, and admin accounts:

`Signup → Login → Profile → Blood Request → Compatibility → Distance → Match → Notification → Accept/Decline → Chat → Completion`

Also test:
- Emergency SOS and escalation
- No compatible donor
- Donation cooldown
- GPS denied
- Offline/network failure
- Duplicate match/notification prevention
- Unauthorized RPC/RLS access
- Admin-only screens and metrics
- Account deletion request

Do not mark production-ready until real-device notification and map tests pass and the authenticated `/production-check` reports `ready_for_application_testing`.