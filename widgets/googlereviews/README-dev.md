## Find a google Place ID

curl -X POST https://places.googleapis.com/v1/places:searchText -H "Content-Type: application/json" -H "X-Goog-Api-Key: AIzaSyCdEg7NOZ51t4GRItRyhA6Nwnmvqlz7HOg" -H "X-Goog-FieldMask: places.id,places.displayName,places.formattedAddress" -d '{
"textQuery": "Southern Cross Solar Ltd Poole UK,Upton Road"
}'
{
"places": [
{
"id": "ChIJz0RrKLKnc0gRj5stGOkCB0o",
"formattedAddress": "Kangaw Pl, Poole BH15 4NH, UK",
"displayName": {
"text": "Southern Solar and Electricals",
"languageCode": "en"
}
}
]
}
