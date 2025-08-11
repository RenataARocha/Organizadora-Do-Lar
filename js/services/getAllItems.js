import { normalizarItem } from '../utils/normalizar.js';

export function getAllItems() {
    const add = (key, tipo) => {
        let arr = JSON.parse(localStorage.getItem(key) || '[]');
        let modified = false;

        // Verificar IDs duplicados
        const idsExistentes = new Set(arr.map(i => i.id));
        arr = arr.map(i => {
            if (!i.id || idsExistentes.has(i.id)) {
                i.id = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
                modified = true;
                console.log(`Gerado novo id para item em ${key}:`, i.id);
            } else {
                console.log(`Item em ${key} já possui id:`, i.id);
            }
            return i;
        });

        if (modified) {
            localStorage.setItem(key, JSON.stringify(arr));
            console.log(`localStorage atualizado para ${key} com novos ids:`, arr);
        }

        return arr.map(i => normalizarItem(i, tipo, key));
    };

    return [
        ...add('tarefas', 'tarefa'),
        ...add('metas', 'meta'),
        ...add('consultas', 'consulta'),
        ...add('contas', 'conta'),
        ...add('remedios', 'remedio'),
        ...add('limpeza', 'limpeza'),
        ...add('skincare', 'skincare'),
        ...add('cronograma', 'cronograma'),
        ...add('cronogramaCapilarEtapas', 'cronograma'),
    ];
}