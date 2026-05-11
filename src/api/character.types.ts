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

export type GuildRankingQuery = {
  date: string
  guild_name?: string
  ranking_type: 0 | 1 | 2
  world_name?: string
}

export type GuildRankingItem = {
  date?: string
  guild_level?: number
  guild_mark?: string
  guild_master_name?: string
  guild_name: string
  guild_point?: number
  ranking: number
  world_name: string
}

export type GuildRankingResponse = {
  ranking?: GuildRankingItem[]
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

export type PetEquipmentItem = {
  item_description?: string | null
  item_icon?: string | null
  item_name?: string | null
  item_option?: Array<{
    option_type?: string
    option_value?: string
  }>
  item_shape?: string | null
  item_shape_icon?: string | null
  scroll_upgrade?: number
  scroll_upgradable?: number
}

export type PetAutoSkill = {
  skill_1?: string | null
  skill_1_icon?: string | null
  skill_2?: string | null
  skill_2_icon?: string | null
}

export type PetEquipmentResponse = {
  date?: string | null
  pet_1_appearance?: string | null
  pet_1_appearance_icon?: string | null
  pet_1_auto_skill?: PetAutoSkill | null
  pet_1_date_expire?: string | null
  pet_1_description?: string | null
  pet_1_equipment?: PetEquipmentItem | null
  pet_1_expired?: boolean | null
  pet_1_icon?: string | null
  pet_1_name?: string | null
  pet_1_nickname?: string | null
  pet_1_pet_type?: string | null
  pet_1_skill?: string[]
  pet_2_appearance?: string | null
  pet_2_appearance_icon?: string | null
  pet_2_auto_skill?: PetAutoSkill | null
  pet_2_date_expire?: string | null
  pet_2_description?: string | null
  pet_2_equipment?: PetEquipmentItem | null
  pet_2_expired?: boolean | null
  pet_2_icon?: string | null
  pet_2_name?: string | null
  pet_2_nickname?: string | null
  pet_2_pet_type?: string | null
  pet_2_skill?: string[]
  pet_3_appearance?: string | null
  pet_3_appearance_icon?: string | null
  pet_3_auto_skill?: PetAutoSkill | null
  pet_3_date_expire?: string | null
  pet_3_description?: string | null
  pet_3_equipment?: PetEquipmentItem | null
  pet_3_expired?: boolean | null
  pet_3_icon?: string | null
  pet_3_name?: string | null
  pet_3_nickname?: string | null
  pet_3_pet_type?: string | null
  pet_3_skill?: string[]
}

export type CharacterStatResponse = {
  character_class?: string
  date?: string
  final_stat?: Array<{
    stat_name?: string
    stat_value?: string
  }>
  remain_ap?: number
}

export type SetEffectResponse = {
  date?: string
  set_effect?: Array<{
    set_effect_info?: Array<{
      set_count?: number
      set_option?: string
    }>
    set_name?: string
    total_set_count?: number
  }>
}

export type AbilityResponse = {
  ability_grade?: string
  ability_info?: Array<{
    ability_grade?: string
    ability_no?: string
    ability_value?: string
  }>
  ability_preset_1?: AbilityPreset | null
  ability_preset_2?: AbilityPreset | null
  ability_preset_3?: AbilityPreset | null
  date?: string
  preset_no?: number
  remain_fame?: number
}

export type AbilityPreset = {
  ability_info?: AbilityResponse['ability_info']
  ability_preset_grade?: string
}

export type SymbolEquipmentResponse = {
  date?: string
  symbol?: Array<{
    symbol_force?: string
    symbol_icon?: string
    symbol_level?: number
    symbol_name?: string
  }>
}

export type LinkSkill = {
  skill_description?: string
  skill_effect?: string
  skill_effect_next?: string
  skill_icon?: string
  skill_level?: number
  skill_name?: string
}

export type LinkSkillResponse = {
  character_link_skill?: LinkSkill[]
  character_link_skill_preset_1?: LinkSkill[]
  character_link_skill_preset_2?: LinkSkill[]
  character_link_skill_preset_3?: LinkSkill[]
  date?: string
  preset_no?: number
}

export type UnionResponse = {
  date?: string
  union_artifact_exp?: number
  union_artifact_level?: number
  union_artifact_point?: number
  union_grade?: string
  union_level?: number
}

export type UnionRaiderResponse = {
  date?: string
  union_block?: Array<Record<string, unknown>>
  union_inner_stat?: Array<Record<string, unknown>>
  union_occupied_stat?: string[]
  union_raider_preset_1?: UnionRaiderPreset | null
  union_raider_preset_2?: UnionRaiderPreset | null
  union_raider_preset_3?: UnionRaiderPreset | null
  union_raider_preset_4?: UnionRaiderPreset | null
  union_raider_preset_5?: UnionRaiderPreset | null
  union_raider_stat?: string[]
  use_preset_no?: number
}

export type UnionRaiderPreset = {
  union_block?: Array<Record<string, unknown>>
  union_inner_stat?: Array<Record<string, unknown>>
  union_occupied_stat?: string[]
  union_raider_stat?: string[]
}

export type UnionArtifactResponse = {
  date?: string
  union_artifact_crystal?: Array<Record<string, unknown>>
  union_artifact_effect?: Array<Record<string, unknown>>
  union_artifact_remain_ap?: number
}

export type UnionChampionResponse = {
  champion_badge_total_info?: Record<string, unknown>
  date?: string
  union_champion?: Array<Record<string, unknown>>
}

export type CharacterSkillGrade =
  | '0'
  | '1'
  | '1.5'
  | '2'
  | '2.5'
  | '3'
  | '4'
  | '5'
  | '6'

export type CharacterSkill = {
  skill_description?: string
  skill_effect?: string
  skill_effect_next?: string
  skill_icon?: string
  skill_level?: number
  skill_name?: string
}

export type CharacterSkillResponse = {
  character_class?: string
  character_skill?: CharacterSkill[]
  character_skill_grade?: CharacterSkillGrade
  date?: string
}

export type HexaMatrixResponse = {
  character_hexa_core_equipment?: Array<{
    hexa_core_level?: number
    hexa_core_name?: string
    hexa_core_type?: string
    linked_skill?: Array<{
      hexa_skill_id?: string
    }>
  }>
  date?: string
}

export type HexaMatrixStatCore = {
  main_stat_level?: number
  main_stat_name?: string
  slot_id?: string
  stat_grade?: number
  sub_stat_level_1?: number
  sub_stat_level_2?: number
  sub_stat_name_1?: string
  sub_stat_name_2?: string
}

export type HexaMatrixStatResponse = {
  character_class?: string | null
  character_hexa_stat_core?: HexaMatrixStatCore[] | null
  character_hexa_stat_core_2?: HexaMatrixStatCore[] | null
  character_hexa_stat_core_3?: HexaMatrixStatCore[] | null
  date?: string | null
  preset_hexa_stat_core?: HexaMatrixStatCore[] | null
  preset_hexa_stat_core_2?: HexaMatrixStatCore[] | null
  preset_hexa_stat_core_3?: HexaMatrixStatCore[] | null
}
