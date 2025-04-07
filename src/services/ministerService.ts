
import { supabase } from "@/integrations/supabase/client";
import { Minister } from "@/types";

export const ministerService = {
  // Buscar todos os ministros
  getAll: async (): Promise<Minister[]> => {
    const { data, error } = await supabase
      .from('minister')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar ministros:', error);
      throw error;
    }
    
    return (data || []).map(minister => ({
      id: String(minister.id),
      name: minister.name || '',
      phone: minister.phone || '',
      email: minister.email,
      username: minister.username || '',
      role: minister.role === 'admin' ? 'admin' : 'minister',
      isActive: minister.isActive || true,
      createdAt: minister.created_at,
      updatedAt: minister.update_at,
      lastLogin: minister.lasLogin,
      profileImage: undefined
    }));
  },
  
  // Autenticar um ministro
  authenticate: async (username: string, password: string): Promise<Minister | null> => {
    // Buscar ministro pelo nome de usuário
    const { data, error } = await supabase
      .from('minister')
      .select('*')
      .eq('username', username)
      .eq('password', password) // Nota: Em produção, use hash de senha!
      .single();
    
    if (error || !data) {
      console.error('Erro de autenticação:', error);
      return null;
    }
    
    // Atualizar último login
    await supabase
      .from('minister')
      .update({ lasLogin: new Date().toISOString() })
      .eq('id', data.id);
    
    return {
      id: String(data.id),
      name: data.name || '',
      phone: data.phone || '',
      email: data.email,
      username: data.username || '',
      role: data.role === 'admin' ? 'admin' : 'minister',
      isActive: data.isActive || true,
      createdAt: data.created_at,
      updatedAt: data.update_at,
      lastLogin: data.lasLogin,
      profileImage: undefined
    };
  }
};
