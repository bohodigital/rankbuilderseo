# Googlebot Log Analysis Field Dictionary

## timestamp_utc

The request timestamp normalized to UTC. Preserve the source timestamp and timezone separately if conversion accuracy is uncertain.

## logging_layer

The system that recorded the request, such as edge, load balancer, origin, web server, or application.

## client_ip

The requester IP visible to the trusted logging layer. Do not assume an origin-visible proxy IP is the original client.

## verified_google_request

A boolean set to true only after the request passes an approved IP-range or forward-confirmed reverse-DNS verification process.

## google_agent_category

One of common crawler, special-case crawler, user-triggered fetcher, other verified Google request, unverified, or not Google.

## user_agent

The reported User-Agent header. This field is descriptive and is not proof of identity.

## method

The HTTP request method.

## scheme

The requested scheme, normally HTTP or HTTPS.

## host

The requested host.

## path

The URL path without the query string.

## query

The raw query string when available.

## normalized_url

The URL produced by the documented analysis normalization rules. Never overwrite the raw path or query.

## status

The response status recorded by the selected logging layer.

## bytes_sent

Response bytes recorded by the selected logging layer. Document whether headers are included.

## response_time_ms

Request-processing time in milliseconds when available. Define the start and end points used by the logging system.

## cache_status

The CDN or application cache result when available.

## referer

The reported Referer request header when logged.

## redirect_target

The response Location target when captured.

## template

The site-defined page or route family.

## canonical_group

The preferred canonical URL or duplicate cluster assigned during analysis.

## notes

Analyst notes, exclusions, uncertainties, or data-quality warnings.
