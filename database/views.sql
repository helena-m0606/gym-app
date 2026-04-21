-- Vista 1: Ingresos por sucursal
CREATE OR REPLACE VIEW vista_ingresos AS
SELECT 
    s.nombre AS sucursal,
    SUM(p.monto) AS total_ingresos
FROM pagos p
JOIN membresias m ON p.membresia_id = m.id
JOIN miembros mi ON m.miembro_id = mi.id
JOIN sucursales s ON mi.sucursal_id = s.id
GROUP BY s.nombre;


-- Vista 2: Asistencia de miembros
CREATE OR REPLACE VIEW vista_asistencia AS
SELECT 
    mi.nombre,
    COUNT(c.id) AS total_checkins
FROM miembros mi
LEFT JOIN checkins c ON mi.id = c.miembro_id
GROUP BY mi.nombre;


-- Vista 3: Ocupación de clases
CREATE OR REPLACE VIEW vista_clases_ocupacion AS
SELECT 
    c.id,
    c.nombre,
    c.capacidad,
    COUNT(r.id) AS inscritos
FROM clases c
LEFT JOIN reservas_clase r ON c.id = r.clase_id
GROUP BY c.id, c.nombre, c.capacidad;


-- Vista 4: Membresías activas
CREATE OR REPLACE VIEW vista_membresias_activas AS
SELECT 
    mi.id AS miembro_id,
    mi.nombre AS miembro,
    s.nombre AS sucursal,
    tm.nombre AS tipo_membresia,
    me.fecha_inicio,
    me.fecha_fin,
    (me.fecha_fin - me.fecha_inicio) AS duracion_dias
FROM miembros mi
JOIN membresias me ON mi.id = me.miembro_id
JOIN tipos_membresia tm ON me.tipo_membresia_id = tm.id
JOIN sucursales s ON mi.sucursal_id = s.id
WHERE me.activa = true;


-- Vista 5: Ventas de productos
CREATE OR REPLACE VIEW vista_ventas_productos AS
SELECT 
    p.nombre AS producto,
    SUM(v.cantidad) AS total_vendidos,
    SUM(v.total) AS ingresos_totales
FROM ventas_productos v
JOIN productos p ON v.producto_id = p.id
GROUP BY p.nombre
ORDER BY ingresos_totales DESC;