## raceWithNotifications or raceN

```ts
function raceWithNotifications<GObservables extends IGenericRaceInObservables>(
  observables: GObservables,
): IObservable<IRaceObservableNotifications<GObservables>>
```

`raceWithNotifications` will wait for the first observable to send a`complete` or `error` Notification.

If it received a `complete` Notification, it will emit the last value received through the `next` Notifications of this observable,
followed by a `complete` Notification.

If it received an `error` Notification, it will immediately send this Notification (`error`).

This is equivalent of `Promise.race`.

### Diagram

#### If one completes

[![](https://mermaid.ink/img/pako:eNqdl0lv2zgUgP-KoKJACriG9sWHAnWWU9Aekpk5VD1Q0pNNmCY9FJXGU-S_DyXbMUkt9gwNBDHe93bykf5tF6wEe2HX8HcDtIA7jFYcbTOa0R3iAhd4h6iwvlqotlheA39BOYH6h_NTB5Ym4BoARwX8hcX6GxO4wgUSmNG6VRoU3CimPumGvv_x3Ea3_Pzly6DqwqLwKhZW7mb06yUITUMF2-4ICMjoICAVZTSqrUnsbC2j9szeAt8iXMri_86oZWW2WMMWMnsh_y2hQg0RmT1TRH8ijruKtEyn04pyVGxWnDW0PKj-WmPp4qDYynccbxHf3zLC-IH4cH97f_vwoDA1FIyWBlXJVaqWBMgu6NC6JjeJM7Ncx_k4s9Jo7sVB6KSJ46cfP_WDWDJeAjf0vUAaiFr9ZFT_PcBBC9G7AX8eemngunEUxJqBU-yD-snlAI4JPMtOqzVyfdd3nKFATdKRy3MHIjJAvspv0nnoHJcrqzr6TQ2QYAqqP79bmj89IF0qdyJdblbKBhlI6wz09kbe1dU9ilM_du6WPbF3FCO5NO-Ic_ZrDaiczKBiVDygLSb7A5FlMisOeVOsQVjbuv0-s16Al4iimdWeFmKoP-F_jifMjXavavlQDmRpHKUPkLQfBaNyWupl0s5RJ-5SHStEQZpadn6ikidCNdMr2HE-PGK6mW46FgTGuw7lCh6vyxwVgmlBdUc3TOeRF7lR4nmBP7Pk1ziOQj_yXS9pz1M8Tx03jZw4CXztPB3MjVeykxtHIycySpN51Pf9isNe3bd4RREZL8BB_jx5NA5bg73KaCeH6Ds3OOT-d6U6sxcqQRjbXUAoE9CLrL-xOkxPVG7QEJUGc7k1-KW7_fo-oygaJg23QfvRZtDhifKt2eaaRfPGk8Oqb0_OVXTjOl57V8k_XhjOLGcepNqmJOJpSPeCA-9cqECbmgLVm37-oR9UeWFievIJSp2yNJi25o94tRYToZ24K5A7xDcTLTxh3xtR4xKuIG8JLjbtA0W_93w38s2Gw_N1pVFgvUB5VcRVpZArjtXbg7R1MoZByeiAqUnSjNDgCo5FP4uqSuQyMX03gtZcVqK9Mch0ohsCEy0AeYFyo0Rh6MllQuas61EFQXXdUmNPnAoT8rzfgTM2CE-AO3bFnQDvPB99J7j8ijzp-Wc91zvrjT7-TnqBohdH1_sLz3qf_4O7SHlhXu8sVoJMklFvrdpbRt_kD4lmVyIB9yWW16G9qBCpYWajRrCnPS3sheANnKDjz7sj9fYvwcov7Q)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNqdl0lv2zgUgP-KoKJACriG9sWHAnWWU9Aekpk5VD1Q0pNNmCY9FJXGU-S_DyXbMUkt9gwNBDHe93bykf5tF6wEe2HX8HcDtIA7jFYcbTOa0R3iAhd4h6iwvlqotlheA39BOYH6h_NTB5Ym4BoARwX8hcX6GxO4wgUSmNG6VRoU3CimPumGvv_x3Ea3_Pzly6DqwqLwKhZW7mb06yUITUMF2-4ICMjoICAVZTSqrUnsbC2j9szeAt8iXMri_86oZWW2WMMWMnsh_y2hQg0RmT1TRH8ijruKtEyn04pyVGxWnDW0PKj-WmPp4qDYynccbxHf3zLC-IH4cH97f_vwoDA1FIyWBlXJVaqWBMgu6NC6JjeJM7Ncx_k4s9Jo7sVB6KSJ46cfP_WDWDJeAjf0vUAaiFr9ZFT_PcBBC9G7AX8eemngunEUxJqBU-yD-snlAI4JPMtOqzVyfdd3nKFATdKRy3MHIjJAvspv0nnoHJcrqzr6TQ2QYAqqP79bmj89IF0qdyJdblbKBhlI6wz09kbe1dU9ilM_du6WPbF3FCO5NO-Ic_ZrDaiczKBiVDygLSb7A5FlMisOeVOsQVjbuv0-s16Al4iimdWeFmKoP-F_jifMjXavavlQDmRpHKUPkLQfBaNyWupl0s5RJ-5SHStEQZpadn6ikidCNdMr2HE-PGK6mW46FgTGuw7lCh6vyxwVgmlBdUc3TOeRF7lR4nmBP7Pk1ziOQj_yXS9pz1M8Tx03jZw4CXztPB3MjVeykxtHIycySpN51Pf9isNe3bd4RREZL8BB_jx5NA5bg73KaCeH6Ds3OOT-d6U6sxcqQRjbXUAoE9CLrL-xOkxPVG7QEJUGc7k1-KW7_fo-oygaJg23QfvRZtDhifKt2eaaRfPGk8Oqb0_OVXTjOl57V8k_XhjOLGcepNqmJOJpSPeCA-9cqECbmgLVm37-oR9UeWFievIJSp2yNJi25o94tRYToZ24K5A7xDcTLTxh3xtR4xKuIG8JLjbtA0W_93w38s2Gw_N1pVFgvUB5VcRVpZArjtXbg7R1MoZByeiAqUnSjNDgCo5FP4uqSuQyMX03gtZcVqK9Mch0ohsCEy0AeYFyo0Rh6MllQuas61EFQXXdUmNPnAoT8rzfgTM2CE-AO3bFnQDvPB99J7j8ijzp-Wc91zvrjT7-TnqBohdH1_sLz3qf_4O7SHlhXu8sVoJMklFvrdpbRt_kD4lmVyIB9yWW16G9qBCpYWajRrCnPS3sheANnKDjz7sj9fYvwcov7Q)

#### If one errored

[![](https://mermaid.ink/img/pako:eNqdl0lv2zgUgP-KoKJACriGqF0-FIiznIL2EHfmMJoDJVEyYZr0UFQaT5D_XkqWYpFa7BkGSGK87618fKTfzJRlyFyZJfqnQjRF9xgWHO5jGtMD5AKn-ACpMG4NWBosKRF_gQlB5V_W3yqw1gGgARym6E8stt-ZwDlOocCMlrXSqOCmZ-qLaujHz00d3frrt2-jqiuDolexMhIQ09tpCHHOePvnNqajlNSW3gZsTM2FuUd8D3EmS_cWU8OITbFFexSbK_lvhnJYERGbi57oD8hxk0_NNDq1KIHpruCsotlJ9dcWC9Qq1vIDx3vIj3eMMH4iPj3cPdw9PvaYEqWMZhqVy5X1LQkka6hC25LchNbCAJb1eWFE_tIOXM-KQsuJPn8ZBrFmPENc07ddacCv9cNJ_Y8ARy34HwacpWdHLgCB7waKgS72Uf3wcgBtAhvZGP0aAQc4ljUWqE5actlgJCIN5EVyEy09q11AVnXyUz9Aginq-3OapfhTA1KlshPpelf0GmQkrTMw6I2kqStoxZETWPfrgdhuxVAuxTuU5-LXFsFsNoOcUfEI95gcT0Qcy6w4Sqp0i4SxL-vPC-MF8QxSuDDq00I09Wf8b3vCgH947ZcPJoistaP0CYX1Tw-jctapZVLOUSNuUp0qREqqUu78TCU7om9mULB2PjxhupvfdCwImt51lBXo6brMYSqYElRzdL1o6ds-8EPbdp2FIT8Gge85vgPssD5PwTKyQORbQeg6ynk6mZuuZCPXjkZCZJQ686T2fcHRsd-3uKCQTBfgJN_MHo1Ta7BXGe3sEP3gRofc_65UY_ZCJQhjhwsIZQINIhs2VoOpicoG9WCmMZe3Br80V-DQp-_746Tm1q1_lBl0emB8r_aJYlG_8eSwGtqTcxXeAMuu7yr5y_a8hWEt3UhpSiKex3QvOLDPhXKVqSlguRvm7zlunqQ6piYfwsjKMo2pa_6Ei62YCa3jrkDuId_NbGGH_ahEiTN0BXlHcLqrHyjqvecA39E3HG2uK00PVguU5GmQ5z2y4Lh_e5C6TtowyBgdMTVL6hFqXMqxGGaR56FcOqZ2I1I2l2XwqA0ylWiGwMwWNA9LrUSeZ8ulQ_qsG1ApgWVZU1NPnBwTsjkekDU1CDsATF1xHWCf56NjuZdfkZ2ec9YD9llv8vHX6bk9vcC_3p931vv6H9z5vRfm9c6CXpBhOOmtVnuP6bv8IlEdMijQQ4bldWiuckhKtDBhJdjzkabmSvAKdVD75ayl3n8DbKMXzg)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNqdl0lv2zgUgP-KoKJACriGqF0-FIiznIL2EHfmMJoDJVEyYZr0UFQaT5D_XkqWYpFa7BkGSGK87618fKTfzJRlyFyZJfqnQjRF9xgWHO5jGtMD5AKn-ACpMG4NWBosKRF_gQlB5V_W3yqw1gGgARym6E8stt-ZwDlOocCMlrXSqOCmZ-qLaujHz00d3frrt2-jqiuDolexMhIQ09tpCHHOePvnNqajlNSW3gZsTM2FuUd8D3EmS_cWU8OITbFFexSbK_lvhnJYERGbi57oD8hxk0_NNDq1KIHpruCsotlJ9dcWC9Qq1vIDx3vIj3eMMH4iPj3cPdw9PvaYEqWMZhqVy5X1LQkka6hC25LchNbCAJb1eWFE_tIOXM-KQsuJPn8ZBrFmPENc07ddacCv9cNJ_Y8ARy34HwacpWdHLgCB7waKgS72Uf3wcgBtAhvZGP0aAQc4ljUWqE5actlgJCIN5EVyEy09q11AVnXyUz9Aginq-3OapfhTA1KlshPpelf0GmQkrTMw6I2kqStoxZETWPfrgdhuxVAuxTuU5-LXFsFsNoOcUfEI95gcT0Qcy6w4Sqp0i4SxL-vPC-MF8QxSuDDq00I09Wf8b3vCgH947ZcPJoistaP0CYX1Tw-jctapZVLOUSNuUp0qREqqUu78TCU7om9mULB2PjxhupvfdCwImt51lBXo6brMYSqYElRzdL1o6ds-8EPbdp2FIT8Gge85vgPssD5PwTKyQORbQeg6ynk6mZuuZCPXjkZCZJQ686T2fcHRsd-3uKCQTBfgJN_MHo1Ta7BXGe3sEP3gRofc_65UY_ZCJQhjhwsIZQINIhs2VoOpicoG9WCmMZe3Br80V-DQp-_746Tm1q1_lBl0emB8r_aJYlG_8eSwGtqTcxXeAMuu7yr5y_a8hWEt3UhpSiKex3QvOLDPhXKVqSlguRvm7zlunqQ6piYfwsjKMo2pa_6Ei62YCa3jrkDuId_NbGGH_ahEiTN0BXlHcLqrHyjqvecA39E3HG2uK00PVguU5GmQ5z2y4Lh_e5C6TtowyBgdMTVL6hFqXMqxGGaR56FcOqZ2I1I2l2XwqA0ylWiGwMwWNA9LrUSeZ8ulQ_qsG1ApgWVZU1NPnBwTsjkekDU1CDsATF1xHWCf56NjuZdfkZ2ec9YD9llv8vHX6bk9vcC_3p931vv6H9z5vRfm9c6CXpBhOOmtVnuP6bv8IlEdMijQQ4bldWiuckhKtDBhJdjzkabmSvAKdVD75ayl3n8DbKMXzg)

### Examples

#### Example 1

```ts
const observable1$ = mergeMapS$$(timeout(500), () => singleN<'a1'>('a1'));
const observable2$ = mergeMapS$$(timeout(1000), () => singleN<'a2'>('a2'));

const subscribe = raceWithNotifications([observable1$, observable2$]);

subscribe((value: IDefaultNotificationsUnion<'a1' | 'a2'>) => {
  console.log(value);
});
```

Output:

```text
// 500ms
'next', 'a1'
'complete', undefined
```
