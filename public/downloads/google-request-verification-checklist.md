# Google Request Verification Checklist

- Preserve the original request record.
- Identify the trusted logging layer.
- Extract the source IP visible at that layer.
- Do not trust the User-Agent string by itself.
- Match the IP against the current official Google crawler or fetcher ranges, or perform reverse DNS followed by forward DNS confirmation.
- Confirm the forward lookup returns the original IP.
- Classify the request as a common crawler, special-case crawler, user-triggered fetcher, other verified Google request, or unverified.
- Record the verification time and method.
- Cache automated verification results only for a documented period.
- Recheck official IP-range files regularly.
- Do not treat every verified Google request as ordinary indexing Googlebot activity.
- Do not expose raw production IP data in public reports.
