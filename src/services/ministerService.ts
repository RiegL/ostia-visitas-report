
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
      id: minister.id,
      name: minister.name || '',
      phone: minister.phone || '',
      email: minister.email,
      username: minister.username || '',
      role: minister.role === 'admin' ? 'admin' : 'user',
      isActive: minister.isActive ?? true,
      createdAt: minister.created_at,
      updatedAt: minister.update_at,
      lastLogin: minister.lastLogin,
      profileImage: undefined
    }));
  },
  
  // Autenticar um ministro
  authenticate: async (username: string, password: string): Promise<Minister | null> => {
    // Buscar ministro pelo nome de usuário
    console.log("Tentando logar com:", { username, password });
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
      .update({ lastLogin: new Date().toISOString() })
      .eq('id', data.id);
    return {
      id: data.id,
      name: data.name || '',
      phone: data.phone || '',
      email: data.email,
      username: data.username || '',
      role: data.role === 'admin' ? 'admin' : 'user',
      isActive: data.isActive ?? true,
      createdAt: data.created_at,
      updatedAt: data.update_at,
      lastLogin: data.lastLogin,
      profileImage: undefined
    };
  },

    // Criar um novo ministro
    create: async (data: Omit<Minister, 'id'>): Promise<Minister> => {
      const { error, data: inserted } = await supabase
        .from('minister')
        .insert([data])
        .select()
        .single();
      
      if (error || !inserted) {
        console.error("Erro ao criar ministro:", error);
        throw error;
      }
  
      return {
        id: inserted.id,
        name: inserted.name || '',
        phone: inserted.phone || '',
        email: inserted.email,
        username: inserted.username || '',
        role: inserted.role === 'admin' ? 'admin' : 'user',
        isActive: inserted.isActive ?? true,
        createdAt: inserted.created_at,
        updatedAt: inserted.update_at,
        lastLogin: inserted.lastLogin,
      };
    },

     // Atualizar um ministro existente
  update: async (id: number, updates: Partial<Omit<Minister, 'id'>>): Promise<Minister> => {
    const { error, data: updated } = await supabase
      .from('minister')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      console.error("Erro ao atualizar ministro:", error);
      throw error;
    }

    return {
      id: updated.id,
      name: updated.name || '',
      phone: updated.phone || '',
      email: updated.email,
      username: updated.username || '',
      role: updated.role === 'admin' ? 'admin' : 'user',
      isActive: updated.isActive ?? true,
      createdAt: updated.created_at,
      updatedAt: updated.update_at,
      lastLogin: updated.lastLogin,
      profileImage: undefined
    };
  },

  // Deletar ministro por ID
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('minister')
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error("Erro ao deletar ministro:", error);
      throw error;
    }
  },
  

};
