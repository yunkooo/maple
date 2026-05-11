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

export type EquipmentOption = {
  all_stat?: string
  armor?: string
  attack_power?: string
  base_equipment_level?: number
  boss_damage?: string
  damage?: string
  dex?: string
  equipment_level_decrease?: number
  exceptional_upgrade?: number
  ignore_monster_armor?: string
  int?: string
  jump?: string
  luk?: string
  magic_power?: string
  max_hp?: string
  max_hp_rate?: string
  max_mp?: string
  max_mp_rate?: string
  speed?: string
  str?: string
}

export type Equipment = {
  additional_potential_option_flag?: string | null
  additional_potential_option_grade?: string | null
  additional_potential_option_1?: string | null
  additional_potential_option_2?: string | null
  additional_potential_option_3?: string | null
  cuttable_count?: string
  date_expire?: string | null
  equipment_level_increase?: number
  freestyle_flag?: string | null
  golden_hammer_flag?: string
  growth_exp?: number
  growth_level?: number
  is_expired?: boolean | null
  item_add_option?: EquipmentOption
  item_base_option?: EquipmentOption
  item_description?: string | null
  item_equipment_part?: string
  item_equipment_slot?: string
  item_etc_option?: EquipmentOption
  item_exceptional_option?: EquipmentOption
  item_gender?: string | null
  item_icon?: string
  item_name?: string
  item_shape_icon?: string
  item_shape_name?: string
  item_starforce_option?: EquipmentOption
  item_total_option?: EquipmentOption
  potential_option_flag?: string | null
  potential_option_grade?: string | null
  potential_option_1?: string | null
  potential_option_2?: string | null
  potential_option_3?: string | null
  scroll_resilience_count?: string
  scroll_upgrade?: string
  scroll_upgradeable_count?: string
  soul_name?: string | null
  soul_option?: string | null
  special_ring_level?: number
  starforce?: string
  starforce_scroll_flag?: string
}

export type EquipmentPresetNo = 1 | 2 | 3

export type EquipmentResponse = {
  item_equipment?: Equipment[] | null
  item_equipment_preset_1?: Equipment[] | null
  item_equipment_preset_2?: Equipment[] | null
  item_equipment_preset_3?: Equipment[] | null
  preset_no?: number | null
}
