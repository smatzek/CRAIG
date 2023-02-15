function newDefaultKms() {
  return [
    {
      name: "kms",
      resource_group: "service-rg",
      use_hs_crypto: false,
      authorize_vpc_reader_role: true,
      use_data: false,
      keys: [
        {
          key_ring: "slz-slz-ring",
          name: "slz-slz-key",
          root_key: true,
          force_delete: true,
          endpoint: "public",
          rotation: 12,
          dual_auth_delete: false
        },
        {
          key_ring: "slz-slz-ring",
          name: "slz-atracker-key",
          root_key: true,
          force_delete: true,
          endpoint: "public",
          rotation: 12,
          dual_auth_delete: false
        },
        {
          key_ring: "slz-slz-ring",
          name: "slz-vsi-volume-key",
          root_key: true,
          force_delete: true,
          endpoint: "public",
          rotation: 12,
          dual_auth_delete: false
        }
      ]
    }
  ];
}

module.exports = { newDefaultKms };
