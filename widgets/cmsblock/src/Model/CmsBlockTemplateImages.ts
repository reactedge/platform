import type {CmsBlockTemplateId} from './CmsBlock.ts';

/**
 * Hard-coded image references representing three visual compositions.
 * Bundled as data images so the gallery works on any ReactEdge host.
 */
const editorial = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 328">
<rect width="540" height="328" fill="#F7F4EF"/>
<rect x="22" y="20" width="496" height="170" rx="5" fill="#B6C8C5"/>
<path d="M22 157L145 77L246 161L376 63L518 153V190H22Z" fill="#698D84"/>
<path d="M22 174L155 119L278 171L387 109L518 168V190H22Z" fill="#3D6862"/>
<circle cx="423" cy="67" r="27" fill="#FBE7AE"/>
<rect x="22" y="212" width="252" height="15" rx="3" fill="#2D4440"/>
<rect x="22" y="246" width="458" height="7" rx="3" fill="#A1ABA7"/>
<rect x="22" y="263" width="418" height="7" rx="3" fill="#A1ABA7"/>
<rect x="22" y="290" width="115" height="18" rx="3" fill="#456A63"/>
</svg>`;

const feature = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 328">
<rect width="540" height="328" fill="#F0F8F8"/>
<rect x="22" y="20" width="233" height="288" rx="5" fill="#C4DBCD"/>
<rect x="48" y="45" width="177" height="239" rx="5" fill="#E2E8DE"/>
<path d="M136 268V105M136 189L80 141M136 227L194 158" stroke="#496D5A" stroke-width="8" stroke-linecap="round"/>
<ellipse cx="93" cy="137" rx="31" ry="13" transform="rotate(28 93 137)" fill="#6D9B7C"/>
<ellipse cx="176" cy="153" rx="34" ry="13" transform="rotate(-34 176 153)" fill="#56876D"/>
<ellipse cx="109" cy="201" rx="29" ry="12" transform="rotate(27 109 201)" fill="#89B095"/>
<rect x="284" y="80" width="189" height="16" rx="3" fill="#214953"/>
<rect x="284" y="109" width="141" height="16" rx="3" fill="#214953"/>
<rect x="284" y="152" width="226" height="7" rx="3" fill="#B2C8C8"/>
<rect x="284" y="170" width="199" height="7" rx="3" fill="#B2C8C8"/>
<rect x="284" y="188" width="218" height="7" rx="3" fill="#B2C8C8"/>
<rect x="284" y="228" width="130" height="33" rx="5" fill="#24717E"/>
</svg>`;

const promotion = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 328">
<rect width="540" height="328" fill="#1D2C39"/>
<rect x="275" y="20" width="243" height="288" rx="4" fill="#DA9468"/>
<circle cx="400" cy="147" r="95" fill="#F8D2A0"/>
<circle cx="426" cy="165" r="76" fill="#B46C53"/>
<path d="M311 263C342 195 426 187 494 224V308H311Z" fill="#6D424C"/>
<rect x="24" y="88" width="196" height="19" rx="3" fill="#FFF"/>
<rect x="24" y="121" width="163" height="19" rx="3" fill="#FFF"/>
<rect x="24" y="167" width="216" height="7" rx="3" fill="#A6BDCC"/>
<rect x="24" y="184" width="182" height="7" rx="3" fill="#A6BDCC"/>
<rect x="24" y="232" width="133" height="36" rx="5" fill="#F2B65C"/>
</svg>`;

const asImage = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

// The same IDs select deterministic layouts on the CMSBlock demo service.
export const CMS_BLOCK_REFERENCE_IMAGES: Record<CmsBlockTemplateId, string> = {
    editorial: asImage(editorial),
    feature: asImage(feature),
    promotion: asImage(promotion),
};
