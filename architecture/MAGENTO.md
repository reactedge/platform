### Magento CSP rules
```
<?xml version="1.0" encoding="UTF-8"?>
<csp_whitelist xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Csp:etc/csp_whitelist.xsd">
<policies>
    <!-- ReactEdge widget scripts -->
    <policy id="script-src">
        <values>
            <value id="reactedge-widgets" type="host">https://*.reactedge.net</value>
        </values>
    </policy>

    <!-- ReactEdge API / services -->
    <policy id="connect-src">
        <values>
            <value id="reactedge-services" type="host">https://*.reactedge.net</value>
        </values>
    </policy>

    <!-- Google fonts -->
    <policy id="style-src">
        <values>
            <value id="google-fonts-css" type="host">https://fonts.googleapis.com</value>
        </values>
    </policy>

    <policy id="font-src">
        <values>
            <value id="google-fonts-fonts" type="host">https://fonts.gstatic.com</value>
        </values>
    </policy>

    <!-- Images -->
    <policy id="img-src">
        <values>
            <value id="google-maps-gstatic" type="host">https://maps.gstatic.com</value>
            <value id="google-maps-apis" type="host">https://maps.googleapis.com</value>
            <value id="googleusercontent" type="host">https://*.googleusercontent.com</value>
            <value id="reactedge-images" type="host">https://*.reactedge.net</value>
        </values>
    </policy>
</policies>
</csp_whitelist>
```

### Luma theme building
```bash
rm -rf pub/static/frontend/*
rm -rf var/view_preprocessed/*
bin/magento setup:static-content:deploy -f 
```

### Hyva theme building
```bash
cd app/design/frontend/Magsite/uk/web/tailwind
npm run watch
rm -rf pub/static/frontend/Magsite/uk
rm -rf var/view_preprocessed
bin/magento cache:clean
```