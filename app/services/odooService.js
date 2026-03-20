// Servicio para conectarse a Odoo 19 via JSON/2 API
// Endpoint: POST /json/2/<model>/<method>
// Docs: https://www.odoo.com/documentation/19.0/developer/reference/external_api.html

const ODOO_URL = process.env.ODOO_URL;      // Ej: http://localhost:8069
const ODOO_API_KEY = process.env.ODOO_API_KEY;  // API Key generada en Odoo
const ODOO_DB = process.env.ODOO_DB;        // Nombre de la base de datos

const FIELDS = [
    'id',
    'name',
    'default_code',
    'list_price',       // precio de venta en product.template
    'available_in_pos',
    'active',
    'sale_ok',
    'categ_id',
    'barcode',
    'write_date'
];

/**
 * Llama a POST /json/2/<model>/<method> con los parámetros dados.
 */
async function callOdoo(model, method, params) {
    const headers = {
        'Authorization': `Bearer ${ODOO_API_KEY}`,
        'Content-Type': 'application/json'
    };
    if (ODOO_DB) headers['X-Odoo-Database'] = ODOO_DB;
    console.log(headers);

    const response = await fetch(`${ODOO_URL}/json/2/${model}/${method}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(params)
    });

    console.log(response)

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Odoo JSON/2 error ${response.status}: ${errorText}`);
    }

    return response.json();
}

/**
 * Obtiene todos los productos activos de Odoo via search_read.
 * Maneja paginación automáticamente.
 */
async function fetchOdooProducts() {
    const limit = 100;
    let offset = 0;
    let allItems = [];
    let hasMore = true;

    while (hasMore) {
        const records = await callOdoo('product.template', 'search_read', {
            domain: [['active', '=', true], ['sale_ok', '=', true]],
            fields: FIELDS,
            limit,
            offset
        });

        allItems = allItems.concat(records);
        hasMore = records.length === limit;
        offset += limit;
    }

    return allItems;
}

/**
 * Mapea un registro de product.template de Odoo al formato del modelo local.
 */
function mapOdooProduct(item) {
    return {
        odooTemplateId: item.id,
        code: item.default_code || null,
        name: item.name,
        salePrice: item.list_price || 0,
        availableInPos: item.available_in_pos || false,
        active: item.active,
        saleOk: item.sale_ok,
        category: item.categ_id
            ? { id: item.categ_id[0], name: item.categ_id[1] }
            : { id: null, name: null },
        barcode: item.barcode || null,
        odooWriteDate: item.write_date || null,
        syncedAt: new Date()
    };
}

/**
 * Busca un partner en Odoo por nombre (ilike).
 * Devuelve { id, name } o null si no se encontró.
 */
async function resolvePartner(partnerName) {
    const results = await callOdoo('res.partner', 'search_read', {
        domain: [['name', 'ilike', partnerName]],
        fields: ['id', 'name'],
        limit: 1
    });
    return results?.[0] ?? null;
}

/**
 * Crea un sale.order en Odoo y lo confirma.
 * @param {number} partnerId
 * @param {Array} lineas - [{ odooProductId, cantidad, precioUnitario }]
 */
async function createAndConfirmSaleOrder(partnerId, lineas) {
    const orderLines = lineas.map(l => [0, 0, {
        product_id: l.odooProductId,
        product_uom_qty: l.cantidad,
        price_unit: l.precioUnitario
    }]);

    const createResult = await callOdoo('sale.order', 'create', {
        vals_list: [{
            partner_id: partnerId,
            order_line: orderLines
        }]
    });

    const saleOrderId = Array.isArray(createResult) ? createResult[0] : createResult;
    await callOdoo('sale.order', 'action_confirm', { ids: [saleOrderId] });

    return { saleOrderId };
}

module.exports = { callOdoo, fetchOdooProducts, mapOdooProduct, resolvePartner, createAndConfirmSaleOrder };
