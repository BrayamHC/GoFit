export function generarDescripcionActualizacion(
    entidad: string,
    campos: any,
    usuarioNombre: string,
    mapeoNombres: Record<string, string>
): string {
    const camposLegibles = Object.keys(campos)
        .map(campo => mapeoNombres[campo] || campo)
        .join(', ');

    return `${entidad} actualizado (campos: ${camposLegibles}) por '${usuarioNombre}'`;
}
