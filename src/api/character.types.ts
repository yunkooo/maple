export type RequestStatus = 'idle' | 'loading' | 'error'

export type CharacterOcidResponse = {
  ocid: string | undefined
}

export type CharacterBasic = {
  character_class: string
  character_class_level: string
  character_exp: number
  character_exp_rate: string
  character_gender: string
  character_guild_name: string
  character_image: string
  character_level: number
  character_name: string
  date: string
  world_name: string
}

export type CashItem = {
  cash_item_equipment_part: string
  cash_item_equipment_slot: string
  cash_item_name: string
  cash_item_icon: string
  cash_item_description: string
  cash_item_option: Array<{
    option_type: string
    option_value: string
  }>
  date_expire: string
  date_option_expire: string
  cash_item_label: string
  cash_item_coloring_prism: {
    color_range: string
    hue: number
    saturation: number
    value: number
  }
  item_gender: string
}

export type CashEquipmentResponse = {
  additional_cash_item_equipment_base?: CashItem[]
  additional_cash_item_equipment_preset_1?: CashItem[]
  additional_cash_item_equipment_preset_2?: CashItem[]
  additional_cash_item_equipment_preset_3?: CashItem[]
  cash_item_equipment_base?: CashItem[]
  cash_item_equipment_preset_1?: CashItem[]
  cash_item_equipment_preset_2?: CashItem[]
  cash_item_equipment_preset_3?: CashItem[]
  character_class?: string
  character_gender?: string
  date?: string
  preset_no?: number
}

export type BeautyEquipmentResponse = {
  date: string
  character_gender: string
  character_class: string
  character_hair: {
    base_color: string
    hair_name: string
    mix_color: string
    mix_rate: string
  }
  character_face: {
    base_color: string
    face_name: string
    mix_color: string
    mix_rate: string
  }
  character_skin_name: string
  additional_character_hair: null
  additional_character_face: null
  additional_character_skin_name: null
}

export type Equipment = {
  item_equipment_part?: string
  item_equipment_slot?: string
  item_icon?: string
  item_name?: string
  item_total_option?: {
    all_stat?: string
    attack_power?: string
    boss_damage?: string
    damage?: string
    magic_power?: string
  }
  potential_option_1?: string
  potential_option_2?: string
  potential_option_3?: string
  additional_potential_option_1?: string
  additional_potential_option_2?: string
  additional_potential_option_3?: string
  starforce?: string
}

export type EquipmentResponse = {
  item_equipment?: Equipment[]
}

export type Notice = {
  notice_id: number
  title: string
  url: string
  date: string
}

export type NoticeResponse = {
  notice?: Notice[]
}
